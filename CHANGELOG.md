# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows
[Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-21

### Added

- The `csv` export type for osmotic's `.export()`, moved out of osmotic's former
  `.csv()` command. Rows are streamed to disk with the same options: `columns`,
  `delimiter` (default `;`) and `bom` (default `true`).
- Plugin options set the defaults for every file, and `type` registers them under
  another export type, so several sets of defaults can be used side by side.
- A file that can't be opened or written fails the run instead of crashing the process.

[1.0.0]: https://www.npmjs.com/package/osmotic-plugin-csv/v/1.0.0
