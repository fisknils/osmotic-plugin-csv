// The csv export type's options, as a CommonJS caller sees them
import { Osmotic } from 'osmotic';
import csv = require('../src/index.cjs');

const options: csv.CsvOptions = { columns: ['a', 'b'], delimiter: ',' };
new Osmotic().get('https://example.com').export('csv', 'out.csv', options).export('csv', 'other.csv');
new Osmotic().export('csv', 'out.csv', { columns: null });

// @ts-expect-error: bom is a boolean
new Osmotic().export('csv', 'out.csv', { bom: 'yes' });

// @ts-expect-error: delimiter is a string
new Osmotic().export('csv', 'out.csv', { delimiter: 1 });
