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
