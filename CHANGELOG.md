# Changelog — frontend

## Unreleased (branch `modernization`)

### Security & backend alignment
- API base URL now comes from `VITE_API_URL` (was hardcoded to `http://localhost:5000`).
- A wrong password no longer reloads the login page and hides the error: the 401 redirect only applies to expired/revoked sessions, which now show a "session ended" notice.
- Admin "Add Teacher" no longer sets the shared password `password123`; the admin gets a one-time invitation link (copy dialog) and can issue a new one with **Send link**.
- New `/set-password` page for invitation / reset links.
- Pending and rejected gallery uploads are loaded with the session token (`ProtectedMedia`), because the backend no longer serves them publicly.
- Registration enforces the new password policy and shows the server's error message.
- Upload picker restricted to the file types the server accepts.
- Fee recording uses the payment methods the database allows (`net_banking`, `cheque`).
- Teacher profile now actually saves specialization, qualifications and experience.
- Removed debug logging of auth responses.
- **Removed admin/teacher/student credentials (`password123`) that the public login page displayed to every visitor.** A development-only hint lists the `seed:dev` demo emails without passwords.

### Functionality (phase 6) — every page now uses real data
- **Foundation:** the API client unwraps the backend's `{ success, data }` envelope once; complete service modules for students, teachers, admins and the public site (dead methods pointing at non-existent endpoints removed); toast notifications replace `alert()` and appear only after the server confirms; shared `ErrorState` (with retry), loading and empty states on every data page; a `useLevels` hook replaces hardcoded level lists; calendar dates parsed as local dates (no off-by-one-day).
- **Admin:** Add Student (with batch, enrolment note and invitation link) and Edit Student (incl. batch reassignment); student/teacher reset links; teacher Edit form; batch Edit/Activate/Deactivate; fee list fixed (names, months, paid/pending/overdue) with due dates; dashboard figures computed from real fees and attendance (no more 87%/93% placeholders, broken report links replaced); Analytics and Status History load real data; Gallery management (upload, hide/show, edit, delete, previews of hidden items); new **Messages** inbox for the contact form.
- **Teacher:** attendance marking for real batches (pre-fills saved attendance, bulk actions, deep link from the dashboard); monthly reviews saved to the database (duplicate/validation errors shown); batch transfers (one-day or permanent, incoming and outgoing history); learning resources (file upload or https link, open, delete); new **Makeup Requests** page to approve/decline/mark attended; dashboard shows today's classes and pending attendance; broken dashboard links fixed.
- **Student:** attendance, fees (real plan, dues, history, change payment plan), schedule (weekly grid from the batch's days, real event notices), activity log (create/edit/delete, server stats), teacher reviews (mark as read), makeup requests, learning resources — all database-backed. The dashboard no longer shows fabricated fallback data on error.
- **Public site:** Teachers and Gallery pages show real data; the contact form stores messages for the admin and reports real success/failure; registration uses levels and fees from the database.
- Removed fabricated "NEW" sidebar badges and claims that "the student will be notified" (no notification system exists).

### UI/UX redesign (phase 7)
- **Design system:** brown and antique gold on warm ivory/sand neutrals (Tailwind tokens; `gray` mapped to warm stone), Playfair Display headings with Inter body text, component classes for buttons, cards, forms, tables, badges, callouts, tabs and skeletons, visible focus rings, and `prefers-reduced-motion` support.
- **UI kit** (`src/components/ui`): `Modal` (focus trap, Esc, scroll lock, bottom sheet on phones), `FileDrop` (keyboard-accessible drag-and-drop with a size check), `PageHeader`, `StatCard`, `RowAction`, skeletons, `ImagePlaceholder` (clearly labelled), `Icon`, `Logo`. `ConfirmProvider`/`useConfirm` replaces every `window.confirm`/`window.prompt`.
- **Layouts:** a separate `PublicLayout` (sticky navbar, slide-in mobile drawer, footer) and `PortalLayout` (sidebar, mobile drawer, top bar with a change-password button). The portal sidebar no longer appears on public pages. The footer, which was never rendered, is now shown. Navbar, sidebar and content offsets are fixed. New 404 page. Portal pages get browser tab titles.
- **Public site** rebuilt with live data: the home page (hero uses the newest gallery photo or a labelled placeholder; levels, teachers, gallery strip and notices from the API), About (live fee table), Teachers, Gallery (lightbox with keyboard navigation), Notices, Contact (FAQ now describes actual system behaviour), Login, Register, Set password (show/hide password, live password rules).
- **Academy details** live in `src/config/academy.js`. Unknown details are hidden instead of showing `XXXX`/`[Your Address Here]`. Social links that pointed at the generic Facebook, Instagram and YouTube homepages are hidden until real URLs are set.
- **All 29 portal pages** redesigned: consistent headers, stat cards, tables that collapse columns on small screens, accessible dialogs, segmented attendance controls with a sticky save bar, and skeleton loading states.
- **Change password** for every role (`PUT /api/auth/change-password`).
- **Fixes found during the redesign:**
  - Registration rejected passwords without the letter "d" (`/d/` instead of `/\d/`).
  - The admin dashboard showed a hardcoded "+12 this month".
  - The teacher students page listed level names that don't exist, had a "View Details" button that did nothing, and showed NaN for an empty list.
  - The teacher profile had dead Change Photo and Change Password buttons, and name and address fields that were never saved.
  - The batch transfer page falsely claimed students are notified by email or SMS.
  - The gallery "View Full" button did nothing, and the Notices page linked to a "Manage Notifications" feature that doesn't exist.
  - The Contact FAQ quoted a fee that contradicted the database.
  - The "Remember me" checkbox did nothing.
  - Some dates displayed a day early (UTC parsing).
  - The upload limit hint said 10 or 100 MB; the server limit is 50 MB.
  - Review month filters ignored the year.
- **Tests:** `src/App.smoke.test.js` renders all 39 routes (public pages and each portal) with the API unreachable. It checks the right layout, no crashes, and route guards.

### Known blockers (need external input)
- **Online fee payment** needs payment-gateway credentials (e.g. Razorpay). Students are told to pay at the office; admins record payments.
- **Email delivery** (invitation/reset links, contact-form alerts) needs SMTP or an email API; links are shown to the admin to share manually.
- **Social media links** on the Contact page point to generic sites until the academy's real profile URLs are provided.

### Code quality, testing and deployment (phases 8–10)
- **Build tooling:** Create React App replaced by **Vite 6**, Vitest 5 and ESLint 9 (flat config). Production build 2.6 s (was 16 s). `npm audit`: 0 vulnerabilities (CRA brought 62, 3 critical; axios and react-router upgraded to patched releases, React Router 7).
- Environment variable renamed `REACT_APP_API_URL` → `VITE_API_URL`. A production build no longer falls back to `localhost`; with no value it calls its own origin. Output directory is now `dist`.
- Pages are **lazy-loaded** per route (main bundle 309 kB / ~100 kB gzip; each page its own chunk), with skeleton fallbacks inside both layouts.
- Fees, Messages and Status-history pages load 100–200 records at a time with a **Load more** control (`X-Total-Count` header).
- Removed the unused `LoadingSpinner` component and redundant try/catch wrappers in two service modules; JSX files are now `.jsx`.
- `vercel.json` (SPA rewrites, immutable asset caching, security headers) and `public/_redirects`.
- Scripts: `npm run dev | build | preview | test | lint`.
