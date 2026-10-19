# Genuine media requirements

The business supplied the official Horsham logo at `https://assets.cdn.filesafe.space/OvJwbyYdrzzTkNVRnie5/media/6ad69a053b8fa9783e767b62.png`. The header and footer reference that original PNG directly, independently of photography approval, with a maximum display width of 224 CSS pixels (152 on mobile). No lossy conversion, stretching, or CSS filter is applied to the artwork. The workspace network cannot access this CDN, so the actual source resolution and external image delivery still need checking in a browser with CDN access.

No athlete/facility originals were attached. No AI athlete photography, stock facility imagery, recreated runner logo, or fabricated coach portraits are used. The photography switch remains off; public launch checks require the real photos.

The brief lists these **suggested** original filenames. The descriptions are not verified against file contents. Inspect originals before making these assignments:

| Original from brief           | Intended derivative                               | Intended placement                   |
| ----------------------------- | ------------------------------------------------- | ------------------------------------ |
| Business-supplied official PNG | Original CDN URL in `src/lib/assets.ts`           | Header/footer                        |
| DSC07637.jpg                  | `public/media/sprint-acceleration.webp`           | Hero                                 |
| DSC07490.jpg                  | `public/media/resisted-sprint.webp`               | Speed panel                          |
| DSC07685.jpg                  | `public/media/strength-conditioning.webp`         | Strength panel                       |
| DSC07577.jpg                  | `public/media/agility-training.webp`              | Performance panel                    |
| DSC07564.jpg                  | `public/media/individual-coaching.webp`           | Coaching                             |
| DSC07587.jpg                  | `public/media/group-training.webp`                | Facility gallery                     |
| DSC07691.jpg                  | `public/media/horsham-facility.webp`              | Facility gallery                     |
| DSC07582.jpg                  | Optional additional approved speed/coaching image | Available alternate after inspection |

Keep original masters outside public files, optionally in ignored `assets/originals/`, with a durable business-owned copy. Do not alter faces, bodies, equipment, or facility details. Verify usage rights and consent for youth images before public use.

Use approved derivatives up to roughly 2000px for the hero and 1200px for gallery images. Next Image generates responsive AVIF/WebP at runtime, prioritizes the hero, and lazy-loads below-fold images. Ensure the original optimization preserves subjects; check mobile `object-position` in `globals.css` and adjust per approved crop. Change alt text if the actual image differs from the intended content.

Use the supplied official brand asset to produce `src/app/icon.png` (favicon), and add an approved social sharing image as `src/app/opengraph-image.jpg` if available. Do not invent a logo or use the placeholder text identity as an official mark. Adding these files uses Next.js metadata conventions automatically.

Set `MEDIA_APPROVED=true` **only after every required file exists and is visually verified**. Then rerun build, browser tests, image loading assertions, screenshots, and Lighthouse against actual photography; text-only performance numbers do not establish photographic-page performance.
