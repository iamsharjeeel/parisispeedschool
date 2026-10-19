# Genuine media requirements

The business supplied the official Horsham logo at `https://assets.cdn.filesafe.space/OvJwbyYdrzzTkNVRnie5/media/6ad69a053b8fa9783e767b62.png`. The header and footer reference that original PNG directly, independently of photography approval, with a maximum display width of 224 CSS pixels (104–144 on mobile). No lossy conversion, stretching, or CSS filter is applied to the artwork. The workspace network cannot access this CDN, so the actual source resolution and external image delivery still need checking in a browser with CDN access.

The four unchanged coach portraits are copied from the official Horsham Team page: `/assets/coach-dom-BwA22uKJ.webp`, `/assets/coach-jalen-fEhqYnQx.webp`, `/assets/coach-mike-3Jj5NUhm.webp`, and `/assets/coach-ali-CP2nDG2Z.webp`. All are 800 × 1000 WebP originals, visually checked and served locally from `public/media/`. Names, roles, and short biographies follow that page. The homepage parent quote is attributed to Sarah M. and linked to its publication on the official homepage; no independently verified review rating is claimed.

The official Facility page says facility photographs are forthcoming. The optional full training-photo layout stays off until its actual files are available. This does not block the live typography-and-coach-photo site.

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

Metadata references the supplied original PNG as the site icon. A separate square official favicon and social-sharing image can replace it when supplied; no recreated mark is used.

Set `MEDIA_APPROVED=true` **only after every required file exists and is visually verified**. Then rerun build, browser tests, image loading assertions, screenshots, and Lighthouse against actual photography; text-only performance numbers do not establish photographic-page performance.
