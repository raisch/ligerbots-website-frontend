# Directus Schema Snapshot Script

## Overview

The `get-directus-schema` script retrieves the current schema snapshot from a Directus server and saves it as a JSON file. This is useful for backing up your Directus configuration, version control of schema changes, or migrating schemas between environments.

## Prerequisites

- `curl` - for HTTP requests
- `jq` - for JSON processing

Install on macOS:
```bash
brew install jq
```

## Usage

### Basic Usage
```bash
./bin/get-directus-schema
```
This will prompt you for server URL (defaults to admin.0mo.cc), username, and password.

### With Command Line Options
```bash
./bin/get-directus-schema --server myserver.com --user admin --output my-schema.json --verbose
```

### Available Options

- `--server <url>` - Directus server URL (default: admin.0mo.cc)
- `--user <username>` - Username for authentication
- `--output <file>` - Output file name (default: directus-schema-snapshot.json)
- `--help` - Show help message
- `--debug` - Enable debug output
- `--dry-run` - Show what would be done without executing
- `--verbose` - Enable verbose output

### Examples

1. **Basic usage with prompts:**
   ```bash
   ./bin/get-directus-schema
   ```

2. **Specify server and user:**
   ```bash
   ./bin/get-directus-schema --server localhost:8055 --user admin
   ```

3. **Full specification with verbose output:**
   ```bash
   ./bin/get-directus-schema --server https://myapp.directus.app --user admin@example.com --output prod-schema.json --verbose
   ```

4. **Dry run to test without making actual requests:**
   ```bash
   ./bin/get-directus-schema --dry-run --debug
   ```

## Output

The script will create a JSON file containing the complete Directus schema snapshot including:
- Collections and their configurations
- Fields and their types
- Relations between collections
- Permissions settings
- Roles configuration

## Error Handling

The script includes comprehensive error handling for:
- Network connectivity issues
- Authentication failures
- Invalid server responses
- Missing dependencies
- File write permissions

## Security Notes

- Passwords are entered securely (not echoed to terminal)
- Access tokens are not logged in verbose mode
- The script uses HTTPS by default for secure communication

## Integration

This script can be integrated into your deployment pipeline for:
- Schema backups before deployments
- Environment synchronization
- Version control of schema changes
- Automated testing of schema migrations