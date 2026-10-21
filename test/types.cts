// Type check only (tsc -p test): the published declarations, as a CommonJS caller sees them
import { Osmotic } from 'osmotic';
import csv = require('osmotic-plugin-csv');

const options: csv.CsvOptions = { columns: ['a', 'b'], delimiter: ',' };
Osmotic.plugins([csv, csv({ type: 'csv-plain', bom: false })]);

new Osmotic().get('https://example.com').export('csv', 'out.csv', options).export('csv', 'other.csv');

// @ts-expect-error: bom is a boolean
new Osmotic().export('csv', 'out.csv', { bom: 'yes' });
