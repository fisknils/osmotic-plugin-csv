# fix/claude-md-for-plugin

## Prompts

1. The repository had no remote. Claude created the public GitHub repository `fisknils/osmotic-plugin-csv` and pushed
   `master` and `fix/csv-writer-filename`. The user then replaced CLAUDE.md with osmotic's CLAUDE.md, unchanged.

   > CLAUDE.md is updated. Be sure the project adheres to it's rules

2. Claude pointed out that the new CLAUDE.md is osmotic's word for word: it describes osmotic's own code and tests, and
   drops the plugin's rules (the factory shape of `index.cts`, the peer dependency check, publishing osmotic first,
   checking CSV files byte for byte). Claude asked whether to adapt it, apply it as written, or wait for the user to
   edit it.

   > Adapt, then comply (Recommended)

## Interpretation

Adopt osmotic's new rules in this repository: pull requests into a protected `master`, CI checks, notes on each prompt
in `PLAN.md`, TypeScript tests run with tsx against `src/`, shared helpers in `test/helpers/`, type tests in `test-d/`,
layered tsconfig files and a `src/` grouped into folders by role. Rewrite the parts that describe osmotic itself for
the plugin, and restore the plugin's own rules that the copy dropped.

This branch changes CLAUDE.md, adds the CI workflow the pull request rules require, and turns on branch protection.
Moving `src/` and the tests into the new layout comes after it, each on its own branch, as CLAUDE.md asks.

## Type

Other (contributor rules and CI).

## Version bump

None.
