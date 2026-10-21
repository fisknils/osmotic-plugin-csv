import type { OsmoticPlugin } from 'osmotic';
import type { CsvOptions, CsvPluginOptions } from './types.js';
import { CsvWriter } from './writer.js';

/**
 * Create the plugin. Pass it to `Osmotic.plugins()` before building chains.
 *
 * @example
 * ```ts
 * Osmotic.plugins([csv({ delimiter: ',', bom: false })]);
 * ```
 */
export function csv(options: CsvPluginOptions = {}): OsmoticPlugin {
	const { type = 'csv', ...defaults } = options;
	return {
		// Plugin names are unique, so each extra type gets its own
		name: type === 'csv' ? 'osmotic-plugin-csv' : `osmotic-plugin-csv:${type}`,
		exporters: {
			[type]: (file: string, opts: CsvOptions = {}) => new CsvWriter(file, { ...defaults, ...opts }),
		},
	};
}
