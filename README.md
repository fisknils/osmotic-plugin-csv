# osmotic-plugin-csv

An [osmotic](https://www.npmjs.com/package/osmotic) plugin that exports scraped rows
to CSV files with `.export('csv', file, options)`.

```js
const { Osmotic } = require('osmotic');

Osmotic.plugins([require('osmotic-plugin-csv')]);

Osmotic.get('https://news.ycombinator.com')
	.find('tr.athing')
	.set({ rank: '.rank', title: '.titleline > a', link: '.titleline > a@href' })
	.export('csv', 'hacker-news.csv')
	.run();
```

- Rows are streamed to disk as they arrive
- Excel-friendly by default: semicolon delimiter and a UTF-8 byte order mark
- Values with quotes, line breaks or the delimiter are quoted; objects and arrays are
  written as JSON
- Several sets of defaults side by side, each under its own export type

## Installation

```sh
npm install osmotic osmotic-plugin-csv
```

`osmotic` (3.0.0 or later) is a peer dependency, so install it alongside the plugin.

## Usage

Load the plugin once, before building any chains:

```js
// CommonJS
const { Osmotic } = require('osmotic');
Osmotic.plugins([require('osmotic-plugin-csv')]);

// ES modules / TypeScript
import { Osmotic } from 'osmotic';
import csv from 'osmotic-plugin-csv';
Osmotic.plugins([csv]);
```

Then add `.export('csv', file, options)` where the rows are complete. Each `data`
object reaching that step becomes a row:

```js
Osmotic.get('https://example.com/products')
	.find('.product')
	.set({ name: 'h2', price: '.price', tags: ['.tag'] })
	.export('csv', 'products.csv', { columns: ['name', 'price'] })
	.run();
```

The file is created when the first row of a run arrives, and starts over on every run.
The header comes from `columns`, or from the keys of the first row. osmotic closes the
file when the run ends, and the run fails if the file can't be written.

## Options

Pass options to `.export()` for one file, or to the plugin to change the defaults for
every file:

```js
Osmotic.plugins([require('osmotic-plugin-csv')({ delimiter: ',', bom: false })]);
```

| Option      | Default                   | Description                                                         |
| ----------- | ------------------------- | ------------------------------------------------------------------- |
| `columns`   | the keys of the first row | Column order. Fields missing from it are skipped, with one warning. |
| `delimiter` | `';'`                     | Field delimiter.                                                    |
| `bom`       | `true`                    | Start the file with a UTF-8 byte order mark.                        |
| `type`      | `'csv'`                   | Plugin only: the export type to register.                           |

The defaults open correctly in Excel in locales that use a decimal comma. Use
`{ delimiter: ',', bom: false }` for plain CSV.

### Several sets of defaults

Load the plugin again with another `type` to use different defaults side by side:

```js
const csv = require('osmotic-plugin-csv');

Osmotic.plugins([csv, csv({ type: 'tsv', delimiter: '\t', bom: false })]);

chain.export('csv', 'for-excel.csv').export('tsv', 'for-tools.tsv');
```

## TypeScript

Type declarations are included for both entry points. Loading the plugin's types
declares the `csv` export type, so `.export('csv', ...)` checks its options. The
`CsvOptions` and `CsvPluginOptions` types are exported. For another `type`, declare it
yourself:

```ts
import type { CsvOptions } from 'osmotic-plugin-csv';

declare module 'osmotic' {
	interface ExportTypes {
		tsv: CsvOptions;
	}
}
```

## Development

```sh
npm install            # install dependencies (does not build)
npm run build          # clean dist/ and compile src/ with tsc (also runs before npm publish)
npm test               # build, type check test/ and test-d/, and run the tests with tsx
npm run format         # format everything with Prettier
npm run format:check   # check formatting without writing
```

The tests use the osmotic checkout next to this one (`file:../osmotic`), so build it
first.

| File                              | Responsibility                                |
| --------------------------------- | --------------------------------------------- |
| `src/core/plugin.ts`              | The plugin and its exporter                   |
| `src/core/CsvWriter.ts`           | Streaming CSV writer                          |
| `src/types/options.ts`            | Options, and the `csv` entry in `ExportTypes` |
| `src/index.cts` / `src/index.mts` | CommonJS and ESM entry points                 |

## License

ISC
