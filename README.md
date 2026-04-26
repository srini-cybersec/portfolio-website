# Portfolio Website — Powered by ATLAS

This repo holds the cybersecurity project data synced weekly from [github.com/srini-cybersec](https://github.com/srini-cybersec) by the ATLAS agent.

## How It Works

ATLAS runs every Sunday at 12PM UTC and:
1. Queries the GitHub GraphQL API for all public repos with cybersecurity topics
2. Generates `src/data/projects.json` with structured project data
3. Generates `src/data/index.json` with portfolio stats
4. Commits and pushes the updated data

## Data Files

| File | Description |
|------|-------------|
| `src/data/projects.json` | All cybersecurity projects with metadata |
| `src/data/index.json` | Portfolio summary (count, categories, last sync) |

## Setup

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `AGENT_GITHUB_TOKEN` | GitHub PAT with `repo` scope |

### Manual Trigger

Go to **Actions → ATLAS Portfolio Sync → Run workflow**
