# Contributing

## Branches

- For every new feature, create a feature branch named `feature/branch-name`.
- For every fix, create a fix branch named `fix/branch-name`.

## Plan

Every branch has a `PLAN.md` in the repository root, written before any code. Keep it up to date while working.

```md
# <Branch name>

## Prompts

Every prompt that shaped this branch, verbatim, in order. Append new ones as they arrive.

## Interpretation

What the prompts are understood to ask for, in your own words. Write it before any code, so a misreading is caught early.

## Type

Feature, Bugfix or Other (formatting, documentation, dependency updates and so on).

## Breaking change

Yes or no, and if yes, what breaks and how to migrate.

## Version bump

Major, minor, patch or none, following from the type and whether it breaks.

## Scope

What this branch does, and what it deliberately leaves out.

## Acceptance criteria

- [ ] Checkable statements. Each one is covered by an automated test, or says why it can't be.

## Affected public API

Export types, plugin options, export options and TypeScript types that are added, changed or removed.

## Impact on the rest of the codebase

- Checked: what was searched or reviewed, such as callers of every changed function or type, modules importing
  changed files, the osmotic APIs the plugin relies on, examples, docs, and other plugins that register export types.
- Found: every effect outside the intended change, or "None". "None" only counts with the list above filled in.

## Decisions

Questions that came up while working, and how they were answered.

## Verification

How each acceptance criterion was checked, and anything left unchecked.

## Follow-ups

Work this branch causes elsewhere, such as osmotic itself, other plugins, publish order, or docs.
```

For changes of type Other, the Prompts, Interpretation, Type and Version bump sections are enough.

## Tests

New features and bugfixes come with automated tests, written before the code:

1. Write tests for the acceptance criteria in `PLAN.md`. A bugfix starts with a test that reproduces the bug.
2. Run them and see them fail. A test that passes before the code exists doesn't test the change.
3. Write the code until the tests pass.

When a test fails against new code, fix the code, not the test. A test may only be changed after the code is written if the test itself is wrong: it has a bug, or it checks something the acceptance criteria don't require. In that case, record in the `Decisions` section of `PLAN.md` what was wrong with the test and why, before changing it. Changing a test to match what the code happens to do is never allowed.

Commit the tests before the code, so the history shows they came first.

### Writing tests

- Use `node:test` and `node:assert/strict`. Runtime tests are `test/*.test.js` and load the built plugin with `require('..')`, the way users load it, together with osmotic through `Osmotic.plugins()`.
- osmotic is a dev dependency on the checkout next to this one (`file:../osmotic`). Build osmotic before running the tests here, and when a change depends on unreleased osmotic behavior, say so in `PLAN.md` under Follow-ups.
- Serve pages from a local HTTP server started in the test file, and write files to a temporary directory from `fs.mkdtempSync()` that is removed when the tests end. Never use `data:` URLs or real websites.
- Check files byte for byte, including the byte order mark, delimiters, quoting and `\r\n` line endings, since spreadsheet programs depend on them.
- Plugins and export types are registered globally and can't be removed, so load each plugin configuration once per test file, before the tests, and give extra export types names unique to the file. Each test file runs in its own process.
- Branches run concurrently, so rows can reach the exporter in any order. Build chains whose row order is fixed, or compare rows sorted.
- `test/types.cts` and `test/types.mts` type-check the published declarations as CommonJS and ES module callers see them, using `@ts-expect-error` for calls that must not compile.
- A test that exposes a bug in existing code keeps its assertion as written. Mark it `{ todo: '<reason>' }` so it is reported without failing the run, record the bug in `PLAN.md` under Follow-ups, and fix it on a `fix/` branch that removes the `todo`.

### Skipping tests

A bugfix may skip the automated test only when one isn't practical, such as for packaging or install problems, documentation, or behavior that depends on the environment. "It takes effort" is not a reason. Type-only fixes are tested in `test/types.cts` and `test/types.mts`. When skipping, the `Verification` section of `PLAN.md` must say why a test isn't practical, and how the fix was checked instead, as steps someone else can repeat.

## Commits

- Commit messages should be short and informative.
- If needed, split up changes (files) into several commits for more valuable commit messages.

## Before merging to master

- Every acceptance criterion in `PLAN.md` is ticked off, or the plan says why it was dropped.
- `npm test` passes.
- Bump the version in `package.json` according to [semantic versioning](https://semver.org/).
- Update `CHANGELOG.md`.
- Read `README.md` and determine whether an update is necessary.
- Check that the `osmotic` peer dependency range still matches the oldest osmotic version the plugin works with.
- Remove `PLAN.md` in a final commit. It stays in the branch's history, which the merge commit keeps reachable.

## After merging to master

- Delete the source branch.
- Make sure the osmotic version in the peer dependency range is published, then run `npm run build` and `npm publish`.

## Project structure

```
src/
  index.cts          CommonJS entry point: module.exports is the plugin factory itself
  index.mts          ESM entry point: re-exports the CommonJS build
  plugin.ts          the plugin factory: options in, osmotic plugin out
  types.ts           public types, and the declarations merged into osmotic's ExportTypes
  writer.ts          the CSV exporter
test/
  *.test.js          runtime tests, one file per feature, against the build
  types.cts          type tests as a CommonJS caller sees the declarations
  types.mts          type tests as an ES module caller sees the declarations
  tsconfig.json      compiles the type tests; never emits
examples/            runnable examples, published with the package
dist/                build output (not committed)
```

- `index.cts` exports the factory function, so `require('osmotic-plugin-csv')` can go straight into `Osmotic.plugins()`, and called with options it returns a configured plugin. Keep that shape.
- Declarations merged into osmotic (`declare module 'osmotic'`) live in `types.ts`, which both entry points import, so every caller gets them.
- Files are kebab-case, except a file that defines a class, which is named after it in PascalCase.
- When `src/` outgrows a handful of files, group it into folders by role as osmotic does: `core/`, `types/`, `errors/` and `utils/`. That move is a refactor of its own, on its own branch, with no behavior changes.

`npm run build` compiles `src/` to `dist/` with `tsconfig.json`. `npm test` builds, type-checks the type tests, and then runs `test/*.test.js`. The `files` field in `package.json` publishes `dist`, `examples` and `README.md`, and `main`, `types` and `exports` point into `dist`.
