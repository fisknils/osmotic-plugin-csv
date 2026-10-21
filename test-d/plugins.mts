// Loading the plugin, as an ES module caller sees it
import { Osmotic } from 'osmotic';
import csv, { type CsvPluginOptions } from '../src/index.mjs';

const options: CsvPluginOptions = { delimiter: '\t', type: 'tsv' };
Osmotic.plugins([csv, csv(options), csv({ type: 'csv-plain', bom: false })]);

// @ts-expect-error: type is a string
csv({ type: 1 });
