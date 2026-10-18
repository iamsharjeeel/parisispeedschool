// No invented brand icon: an approved icon.png is a public-launch prerequisite.
// A neutral empty response avoids a browser 404 while the review lacks that asset.
export function GET() {
  return new Response(null, {
    status: 200,
    headers: { 'Cache-Control': 'public, max-age=86400', 'Content-Type': 'image/x-icon' },
  });
}
