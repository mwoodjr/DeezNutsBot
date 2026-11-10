# Security

Keep real tokens, database passwords, webhook URLs, private keys, and live environment files out of source control and public issues. Use a private channel to report security concerns to the maintainer.

Configure credentials through environment variables. Use dedicated test credentials for live integration testing and keep production credentials out of CI. If a credential is committed, revoke or rotate it through the provider.

The repository includes a lockfile and an offline checks workflow with a dependency audit and secret scanning. Install locked dependencies with `npm ci --ignore-scripts` and review dependency updates before applying them.
