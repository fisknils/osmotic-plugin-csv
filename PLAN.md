# fix/src-layout

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

Move `src/` into the folder layout of CLAUDE.md, with no behavior changes: the plugin factory and the CSV writer go to
`core/`, the public types and the `ExportTypes` declaration to `types/`. The writer's file is named after its class,
`CsvWriter.ts`, which also covers the rename on `fix/csv-writer-filename`; that branch is dropped instead of merged,
since its CLAUDE.md change conflicts with the new CLAUDE.md. The test layout and the layered tsconfig follow on their
own branch.

## Type

Other (refactor).

## Version bump

None. Only files inside `dist/` move; `exports` exposes the two entry points and nothing else, so callers see no
change.
