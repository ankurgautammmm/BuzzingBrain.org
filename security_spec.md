# Security Specification & Test Suite

## 1. Data Invariants
1. A User profile document at `/users/{userId}` can only be read or written by the authenticated owner (`request.auth.uid == userId`) or an admin (`isAdmin()`).
2. A user cannot self-assign or elevate their own role to 'admin' in `/users/{userId}`.
3. A Note document at `/notes/{noteId}` requires `request.auth.uid == incoming().userId` upon creation, and non-admins can only update or delete their own notes.
4. Public notes (`resource.data.isPublic == true`) can be read by any signed-in student, but private notes are only readable by their owner or admins.
5. A Complaint ticket at `/complaints/{complaintId}` can only be created by signed-in users setting `userId == request.auth.uid`. Complainants can only read their own complaints; admins can read and update all complaints.
6. The admin roster at `/admins/{adminId}` can only be read and written by validated administrators.
7. System administrator `brainyyybuzz@gmail.com`, `gautamankur0101@gmail.com`, and `pathpriya99@gmail.com` are bootstrapped as trusted admins.
8. Test attempts at `/test_attempts/{attemptId}` can only be created by the authenticated student for their own record (`incoming().userId == request.auth.uid`), and can only be read by the owner or admins.
9. All string fields have strict bounded sizes and document IDs are verified with `isValidId()`.
10. Collection list queries enforce rule-level authorization (`resource.data.userId == request.auth.uid || isAdmin()`) to prevent unscoped scraping attacks.

## 2. The "Dirty Dozen" Payloads (Designed to Fail)
1. **Unauthenticated Read on User Profiles**: Trying to fetch `/users/{otherId}` without auth -> PERMISSION_DENIED.
2. **Identity Spoofing in Note Creation**: Sending `userId: 'victim_user'` while signed in as `attacker` -> PERMISSION_DENIED.
3. **Privilege Escalation on User Profile**: Calling update on `/users/{uid}` with `role: 'admin'` as student -> PERMISSION_DENIED.
4. **Oversized Field Denial of Wallet**: Submitting note with 2MB title string -> PERMISSION_DENIED.
5. **ID Poisoning Attack**: Target document ID containing invalid path tokens like `../../evil` -> PERMISSION_DENIED.
6. **Unauthorized Note Mutation**: Non-owner trying to update or delete someone else's note -> PERMISSION_DENIED.
7. **Ghost Field Injection**: Adding undocumented `isVerifiedSystem: true` to a note -> PERMISSION_DENIED.
8. **Complaint Tampering by Student**: Non-admin user attempting to change complaint `status` to 'resolved' or edit `adminNotes` -> PERMISSION_DENIED.
9. **Fake Ticket Author**: Creating complaint with `userId: 'other_user'` -> PERMISSION_DENIED.
10. **Direct Admin List Mutation**: Non-admin user attempting to write themselves into `/admins/{attackerUid}` -> PERMISSION_DENIED.
11. **Blanket Query Scraping**: Attempting an unscoped collection scan on complaints or mistakes as a regular student -> PERMISSION_DENIED.
12. **Private Note Leak & Test Tampering**: Non-owner attempting to read a private note (`isPublic: false`) or alter another student's test attempt score -> PERMISSION_DENIED.
