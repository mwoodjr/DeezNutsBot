# Known issues and follow-up

These pre-existing behaviors were observed during review and intentionally left for a separate functional change:

- `events/messageCreate.js` repeats the `$set` property in one update object. JavaScript keeps only the last property, so several guild fields do not update as intended.
- `/user` assumes a database record exists and can fail for a first-time user. `/leaderboard` loads all users before sorting, and an empty leaderboard may produce an invalid empty embed description.
- `/stats` labels host memory values as MB while dividing bytes only by 1024, lacks an early return in its DM guard, and presents local cache statistics with confusing shard/cluster labels.
- The guild-join handler writes `joinedMemberCount`, while the schema defines `memberCount`. Runtime behavior and existing records need verification against a development database.
- API handlers now await requests but still lack full status/body validation and consistent user-facing failure responses.
- A failed MongoDB connection is logged, but does not gate Discord login or implement application readiness. The generic unhandled-rejection handler keeps the process running, which can hide degraded service.
- Model creation uses a check-then-create sequence and may race across processes. Unique indexes mitigate duplicate IDs but require actual database verification.
- Daily process exit depends on an external supervisor. Shutdown and database disconnect handling need an isolated runtime test.
- The message handler assumes guild context and does not await every message/reaction operation. It has no per-user cooldown. The gateway configuration currently does not request direct messages.
- The source code contains no vote ingestion service, backup policy, retention/deletion workflow, metrics exporter, or health endpoint.

Do not claim these behaviors were verified against live services. Compatible dependency security updates were applied; the online npm audit reported zero known vulnerabilities on October 29, 2026. Repeat the audit before publication if dependencies or advisories change.
