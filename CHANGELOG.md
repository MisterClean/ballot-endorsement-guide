# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `fork-and-customize` Claude Code agent skill (`.claude/skills/fork-and-customize/SKILL.md`) that interactively guides users through forking and customizing the app for a new organization, election, and jurisdiction. Covers branding, district maps, endorsements, geocoding provider selection, deployment, and testing.

## [0.1.0] - 2026-02-06

### Added

- Initial open-source baseline for Ballot Endorsement Guide.
- Configurable organization branding and jurisdiction map-pack architecture.
- Provider-pluggable geocoding (geocode.earth, Mapbox, Google Maps, Geoapify).
- Address and coordinate lookup APIs with shareable URL hydration.
- Docker and Railway deployment support.
- Test suite and lint checks for core lookup behavior.
