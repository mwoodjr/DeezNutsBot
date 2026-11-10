# Release preparation changes

- Created a separate sanitized directory from the existing working tree; did not alter the source checkout or copy its Git history into the release repository.
- Retained all ten current commands, event routing, models, and the original joke dictionary. Removed static Discord-hosted artwork URLs and original installation links; supplied per-installation link configuration.
- Replaced the literal RapidAPI key with `RAPIDAPI_KEY`. Omitted the original `.env`, `config.json`, and deployment workflow.
- Centralized configuration in `config.js`, standardized Discord/database environment variable names, added strict feature flags and startup validation, and supplied a placeholder-only `.env.example`.
- Made database helpers and database commands honor the disabled flag in both development and normal mode. Removed the duplicate database connection in the guild-join event and obsolete Mongoose connection options.
- Replaced a hardcoded application guild-count request with the existing hybrid-sharding library's automatic shard recommendation. Kept two shards per process cluster and the existing daily scheduled exit.
- Prevented raw exceptions and database documents from being printed. Awaited external joke request promises so their failures reach the existing handlers; added request timeouts and an optional-key guard.
- Added a registration dry run, syntax checks, eight isolated regression tests and two real Mongoose model validation tests, and a supplemental scanner that prints locations only.
- Added Dockerfile, Compose packaging, secret exclusions, CI checks without deployment, and documentation. An online audit identified six dependency vulnerabilities; compatible updates resolved them without a major upgrade to any direct dependency. discord.js moved from 14.16.3 to 14.27.0, Mongoose from 8.8.2 to 8.24.7, with transitive fixes recorded in the lockfile.
- The standalone portfolio snapshot starts with one commit containing the reviewed files.
