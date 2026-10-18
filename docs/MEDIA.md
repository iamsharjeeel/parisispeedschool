# Genuine media requirements

No athlete/facility originals or downloadable official logo source files were attached. No AI athlete photography, stock facility imagery, recreated runner logo, or fabricated coach portraits are used. Current asset switches remain off; public launch checks require the real files.

The brief lists these **suggested** original filenames. The descriptions are not verified against file contents. Inspect originals before making these assignments:

| Original from brief           | Intended derivative                               | Intended placement                   |
| ----------------------------- | ------------------------------------------------- | ------------------------------------ |
| Approved official logo source | `public/media/parisi-logo.webp`                   | Header/footer                        |
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
