// Local-only test double. Never deploy this process or use it to receive real leads.
import http from 'node:http';
let mode = 'success';
const deliveries = [];
const leads = new Map();
const server = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString();
  const body = raw ? JSON.parse(raw) : {};
  const send = (status, value) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(value));
  };
  if (req.url === '/health') return send(200, { ok: true });
  if (req.url === '/reset') {
    deliveries.length = 0;
    leads.clear();
    mode = body.mode || 'success';
    return send(200, { ok: true });
  }
  if (req.url === '/mode') {
    mode = body.mode;
    return send(200, { ok: true });
  }
  if (req.url === '/leads')
    return send(200, { leads: [...leads.values()], requests: deliveries });
  if (req.url === '/crm') {
    if (
      req.method !== 'POST' ||
      req.headers['content-type'] !== 'application/json' ||
      req.headers.accept !== 'application/json'
    )
      return send(415, { error: 'Expected a JSON POST' });
    if (mode === 'failure')
      return send(503, { error: 'Synthetic CRM failure' });
    const id = req.headers['idempotency-key'];
    if (!id) return send(400, {});
    deliveries.push(body);
    if (!leads.has(id)) leads.set(id, body);
    if (mode === 'timeout') {
      setTimeout(() => send(200, { accepted: true }), 20000);
      return;
    }
    if (mode === 'slow') {
      setTimeout(() => send(200, { accepted: true }), 300);
      return;
    }
    return send(200, { accepted: true });
  }
  send(404, {});
});
server.listen(4319, '127.0.0.1', () =>
  console.log('Synthetic integration fixture ready on 4319'),
);
process.on('SIGTERM', () => server.close());
