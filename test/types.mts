// Type check only (tsc -p test): the published declarations, as an ES module caller sees them
import { Osmotic } from 'osmotic';
import csv, { type CsvPluginOptions } from 'osmotic-plugin-csv';

const options: CsvPluginOptions = { delimiter: '\t', type: 'tsv' };
Osmotic.plugins([csv(options)]);

new Osmotic().get('https://example.com').export('csv', 'out.csv', { columns: null });

// @ts-expect-error: delimiter is a string
new Osmotic().export('csv', 'out.csv', { delimiter: 1 });
