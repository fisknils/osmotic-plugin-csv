# fix/test-layout

## Prompts

1. The repository had no remote. Claude created the public GitHub repository `fisknils/osmotic-plugin-csv` and pushed
   `master` and `fix/csv-writer-filename`. The user then replaced CLAUDE.md with osmotic's CLAUDE.md, unchanged.

   > CLAUDE.md is updated. Be sure the project adheres to it's rules

2. Claude pointed out that the new CLAUDE.md is osmotic's word for word, and asked whether to adapt it to the plugin,
   apply it as written, or wait for the user to edit it.

   > Adapt, then comply (Recommended)

3. Claude had opened pull request #1 with the adapted CLAUDE.md and CI, turned on branch protection, and stopped before
   merging, since merging needed the user's permission. The remaining work was the `src/` layout and the test layout.

   > I merged the pr

## Interpretation

Bring the tests and the TypeScript config in line with CLAUDE.md, keeping what the tests check:

- Runtime tests become TypeScript in `test/`, one kebab-case file per feature, run with `tsx`, importing the plugin
  from `src/` and loading it through `Osmotic.plugins()`. `test/package.ts` checks the build in `dist/`.
- `test/helpers/` gets `createSite()`/`openSite()`, `scrape()`, `tempDir()` and a web shop scenario site whose
  values need quoting, exported through `test/helpers/index.ts`.
- The type tests move from `test/types.cts` and `test/types.mts` to `test-d/`, one file per feature, still covering
  both a CommonJS and an ES module caller.
- `tsconfig.json` keeps the shared options, `tsconfig.dist.json` builds, `tsconfig.test.json` type-checks `src`,
  `test` and `test-d`. The `build` and `test` scripts use them.

Every check in `test/csv.test.js` survives, byte for byte, against the shop site instead of a one-off page. Based on
`fix/src-layout` (#2), since the tests import its paths; rebased onto `master` once #2 is merged.

## Type

Other (tests and build config).

## Version bump

None. The build output and the published files stay the same.
