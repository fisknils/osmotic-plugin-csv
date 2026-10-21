import { csv as create } from './core/plugin.js';
import type * as types from './types/options.js';

/**
 * Export rows to CSV files with `.export('csv', file, options)`. Load it once, before
 * building chains:
 *
 * ```js
 * Osmotic.plugins([require('osmotic-plugin-csv')]);
 * // or, with default options:
 * Osmotic.plugins([require('osmotic-plugin-csv')({ delimiter: ',', bom: false })]);
 * ```
 */
function csv(options?: types.CsvPluginOptions): import('osmotic').OsmoticPlugin {
	return create(options);
}

namespace csv {
	export type CsvOptions = types.CsvOptions;
	export type CsvPluginOptions = types.CsvPluginOptions;
}

// module.exports is the function itself, so require() can pass it straight to plugins()
export = csv;
