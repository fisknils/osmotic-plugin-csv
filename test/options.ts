import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Osmotic } from 'osmotic';
import csv = require('../src/index.cjs');
import { openSite, scrape, shop, tempDir } from './helpers/index.js';

before(() => Osmotic.plugins([csv, csv({ type: 'csv-options-plain', delimiter: ',', bom: false })]));

const products = (url: string) => Osmotic.get(url).find('.product').set({ name: 'h2', price: '.price' });

test('options passed to export() apply to that file', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'prices.tsv');
	await scrape(products(site.url()).export('csv', file, { delimiter: '\t', bom: false, columns: ['price'] }));
	assert.equal(readFileSync(file, 'utf8'), 'price\r\n499,00\r\n1 299,50\r\n899,00\r\n39,90\r\n');
});

test('a second type carries its own defaults', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'plain.csv');
	await scrape(products(site.url()).export('csv-options-plain', file));
	assert.equal(
		readFileSync(file, 'utf8'),
		'name,price\r\n' +
			'"Desk lamp, black","499,00"\r\n' +
			'"Lamp ""Aurora""","1 299,50"\r\n' +
			'Shelf; oak,"899,00"\r\n' +
			'"Glödlampa\n2-pack","39,90"\r\n',
	);
});
