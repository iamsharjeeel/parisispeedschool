// Local-only test double. Never deploy this process or use it to receive real leads.
import http from 'node:http';
let mode = 'success';
const values = new Map();
const leads = new Map();
function get(key) {
  const item = values.get(key);
  if (!item || item.expires < Date.now()) {
    values.delete(key);
    return null;
  }
  return item.value;
}
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
    values.clear();
    leads.clear();
    mode = body.mode || 'success';
    return send(200, { ok: true });
  }
  if (req.url === '/mode') {
    mode = body.mode;
    return send(200, { ok: true });
  }
  if (req.url === '/leads') return send(200, { leads: [...leads.values()] });
  if (req.url === '/redis') {
    if (req.headers.authorization !== 'Bearer local-test-token')
      return send(401, {});
    const [op, key, ...rest] = body;
    let result = null;
    if (op === 'GET') result = get(key);
    if (op === 'DEL') {
      result = values.delete(key) ? 1 : 0;
    }
    if (op === 'SET') {
      if (!rest.includes('NX') || get(key) === null) {
        const ex = rest.indexOf('EX');
        values.set(key, {
          value: rest[0],
          expires:
            Date.now() + (ex >= 0 ? Number(rest[ex + 1]) * 1000 : 86400000),
        });
        result = 'OK';
      }
    }
    if (op === 'EVAL') {
      const rateKey = rest[1];
      const old = values.get(rateKey);
      result = Number(get(rateKey) || 0) + 1;
      values.set(rateKey, {
        value: String(result),
        expires: old?.expires || Date.now() + 900000,
      });
    }
    return send(200, { result });
  }
  if (req.url === '/crm') {
    if (req.headers.authorization !== 'Bearer local-crm-token')
      return send(401, {});
    if (mode === 'failure')
      return send(503, { error: 'Synthetic CRM failure' });
    const id = req.headers['idempotency-key'];
    if (!id) return send(400, {});
    if (!leads.has(id)) leads.set(id, body);
    if (mode === 'timeout') {
      setTimeout(() => send(200, { accepted: true }), 10000);
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
