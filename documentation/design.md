# Design Decisions & Rationale

This document explains the key architectural and technical decisions made during the development of the Reservation System API.

## 1. Handling Date Conflcits For Better Concurrency Using PostgreSQL Exclusion Constraints (GIST)
**Decision**: Use PostgreSQL GIST indices with `EXCLUDE` constraints for overlap prevention.

- **Why?**: Traditional "check then insert" logic is vulnerable to race conditions unless wrapped in high-isolation transactions (Serializable), which can be slow. Exclusion constraints provide **atomic**, database-level protection.
- **Benefit**: It guarantees data integrity even under high concurrency without requiring complex application-level locking. Also this helps the API to process asynchronous tasks without blocking the I/O operations since the data layer handles the concurrent requests gracefully the application operations can carry on without blocking the main thread.
- **Condition**: By using a **Partial Index** (`WHERE status = 'PENDING'`), we ensure that only active reservations block others, allowing a cancelled slot to be reused immediately without manual constraint cleanup.

## 2. Soft Deletes via Reservation Status
**Decision**: Implement a `status` field (`PENDING`, `COMPLETE`, `CANCELLED`) instead of hard-deleting records.

- **Why?**: Business requirements almost always require an audit trail. Hard-deleting data makes it impossible to analyze cancellation patterns or restore accidentally deleted items.
- **Benefit**: Provides a rich history of reservation lifecycle. It also simplifies the exclusion constraint logic when combined with partial indices.

## 3. UTC-Only Storage with Timezone Context
**Decision**: Standardize all storage on UTC (`timestamptz`) but store the original `timezone` string.

- **Why?**: Handling time across different zones is notoriously difficult. Converting everything to UTC at the edge (the API controller/service) ensures consistency.
- **Benefit**: The database handles interval calculations correctly regardless of DST changes. Storing the `timezone` allows us to precisely recreate the user's local context if needed for future features (like "Remind me at 8 AM local time").

## 4. Background Cleanup (Self-Healing System)
**Decision**: Implement a scheduled task (`@nestjs/schedule`) to scan and update expired reservations.

- **Why?**: Reservations that are never checked in or explicitly cancelled can clutter the "PENDING" state, potentially blocking new reservations indefinitely.
- **Benefit**: Automating this cleanup ensures the system remains "fresh" and self-correcting without manual intervention from administrators.

## 6. V1 Modules Project Structure
**Decision**: Organize code into `src/v1/modules/...`

- **Why?**: Separating the core logic from configuration and common utilities allows the codebase to grow without becoming a "big ball of mud". 
- **Benefit**: Versioning (`v1`) allows for breaking changes in the future without disrupting existing clients, and the module-based split makes it easier for multiple developers to work on different features (Reservations, Users, Resources) simultaneously.
