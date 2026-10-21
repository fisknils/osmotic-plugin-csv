// Declared here, in a file both entry points' declarations import, so callers get it
declare module 'osmotic' {
	interface ExportTypes {
		/**
		 * A CSV file, one row per data object.
		 *
		 * @example
		 * ```ts
		 * .export('csv', 'products.csv', { columns: ['name', 'price'] })
		 * ```
		 */
		csv: CsvOptions;
	}
}

/**
 * How a CSV file is written. The defaults (semicolon, UTF-8 BOM) open correctly in
 * Excel in locales that use a decimal comma.
 */
export interface CsvOptions {
	/**
	 * Column order. Fields missing from it are skipped, with one warning.
	 * @defaultValue the keys of the first row
	 */
	columns?: string[] | null;
	/** @defaultValue `';'` */
	delimiter?: string;
	/**
	 * Start the file with a UTF-8 byte order mark.
	 * @defaultValue `true`
	 */
	bom?: boolean;
}

/** Options for the plugin. CSV options set here are the defaults for every export. */
export interface CsvPluginOptions extends CsvOptions {
	/**
	 * The export type to register. Load the plugin again under another type for a second
	 * set of defaults, e.g. `csv({ type: 'csv-plain', delimiter: ',', bom: false })`.
	 * Declare a type other than `'csv'` in `ExportTypes` to have its options checked.
	 * @defaultValue `'csv'`
	 */
	type?: string;
}
