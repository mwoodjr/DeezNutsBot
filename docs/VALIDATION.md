# Validation

The portfolio snapshot includes syntax checks, ten offline tests, and a command registration dry run that builds the Discord payloads locally. The GitHub Actions workflow also checks dependencies for known advisories and scans the files and history for secrets.

The Docker Compose configuration was checked during release preparation. Docker image build and startup, Discord login and live command registration, MongoDB operations, and live sharding still need integration testing in an isolated environment.
