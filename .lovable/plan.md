## EduShare — Free Educational Courses Portal

A calm, modern, responsive site (inspired by NextToppers/PW/prepprohub but hand-crafted, not AI-generic) where visitors browse free courses organized by coaching institute (Allen, PW, etc.) and exam (JEE/NEET/UPSC). Admins manage everything from inside the same site after logging in.

### Design direction

- **Palette (calming):** soft slate-blue background, warm cream surfaces, deep teal primary, muted coral accent. All tokens in `src/styles.css` (oklch).
- **Type:** Fraunces (display) + Inter (body) — not the usual AI defaults.
- **Feel:** generous whitespace, soft shadows, rounded-2xl cards, subtle gradient meshes behind hero.
- **Animations (Framer Motion):** hero fade/slide-in, scroll-reveal sections, card hover lift, animated count-up stats, smooth page transitions, parallax on coaching logos row.

### Pages / routes

- `/` — Hero, stats, featured coachings strip (logos), popular courses, exam categories, "Masterminds" teaser, CTA.
- `/courses` — Filter by coaching + exam + type (video / pdf / external).
- `/coachings/$slug` — All courses under one coaching (Allen, PW, …).
- `/courses/$slug` — Course detail: embedded YouTube player (lessons list, in-site only), PDF viewer, or external "Open resource" button. Sticky lesson sidebar on desktop.
- `/about` — Masterminds Behind EduShare (founder cards with photo, role, bio, socials).
- `/auth` — Single login/signup (admins log in here too).
- `/admin` — Protected dashboard (only `is_admin` users): manage Coachings, Exams, Courses, Lessons, PDFs, Site settings (Telegram link, founders).

### Telegram pop-up

Modal on first visit (stored in `localStorage`), with Join button → Telegram URL (configurable from admin → site settings). Dismissible, re-shown after 7 days.

### Admin capabilities

- Login with pre-seeded admin email (you'll provide it later; until then I'll seed a placeholder you can change).
- CRUD: Coachings (name, slug, logo upload, color), Exams, Courses (title, slug, description, cover image, coaching, exam, type), Lessons (YouTube URL → embedded), PDF uploads (Lovable Cloud storage), external redirect URL, ordering (drag handle).
- Site settings: Telegram URL, hero copy, founders list.

### Content types per course

1. **YouTube series** — admin pastes video URLs; we extract IDs and embed via `youtube-nocookie.com` in our own player shell (no leaving site).
2. **PDF/notes** — uploaded to storage bucket `course-files`.
3. **External redirect** — opens target in new tab with clear "External resource" label.

### SEO

- Per-route `head()` with unique title/description/canonical/og.
- Dynamic og from course cover image.
- JSON-LD `Course` schema on `/courses/$slug`, `Organization` on `/`.
- `public/sitemap.xml` generated route + `robots.txt`.
- Semantic HTML, single H1 per page, alt text, lazy images.

### Tech / data

- Lovable Cloud (Postgres + Auth + Storage).
- Tables: `profiles` (with `is_admin` bool, auto-created via trigger), `coachings`, `exams`, `courses`, `lessons`, `course_files`, `site_settings`. All with RLS — public SELECT on content tables, write only when `is_admin = true`.
- Server fns (`createServerFn`) for all reads/writes; admin mutations gated by `requireSupabaseAuth` + admin check.
- Storage buckets: `coaching-logos` (public), `course-covers` (public), `course-files` (public for free PDFs).

### Extra features I'll add

- Search bar (courses by title/coaching/exam).
- "Recently added" + "Trending" rails on home.
- Bookmark/save courses (logged-in users).
- Dark mode toggle.
- Breadcrumbs on detail pages (SEO + UX).
- 404 with course suggestions.

### Things I need from you later (won't block v1)

- Pre-seeded admin email address.
- Telegram channel URL.
- Site name confirmation (defaulting to **EduShare**) and founder names/photos/bios for the Masterminds section (placeholders until provided).
- Coaching logos: admin uploads them through the panel (no logos bundled — you control IP).

### Build order

1. Enable Lovable Cloud, schema + RLS + storage buckets + admin trigger.
2. Design tokens, layout shell, header/footer, Telegram popup.
3. Public pages (home, courses list, course detail, coaching, exam, about).
4. Auth + admin dashboard with full CRUD.
5. SEO meta, sitemap, JSON-LD, animations polish.