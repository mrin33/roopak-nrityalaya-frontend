# Changelog — frontend

## Unreleased (branch `modernization`)

### Security & backend alignment
- API base URL now comes from `REACT_APP_API_URL` (was hardcoded to `http://localhost:5000`).
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

### Known blockers (need external input)
- **Online fee payment** needs payment-gateway credentials (e.g. Razorpay). Students are told to pay at the office; admins record payments.
- **Email delivery** (invitation/reset links, contact-form alerts) needs SMTP or an email API; links are shown to the admin to share manually.
- **Social media links** on the Contact page point to generic sites until the academy's real profile URLs are provided.
