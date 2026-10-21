import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Osmotic } from 'osmotic';
import csv = require('../src/index.cjs');
import { openSite, scrape, shop, tempDir } from './helpers/index.js';

before(() => Osmotic.plugins([csv, csv({ type: 'csv-format-plain', delimiter: ',', bom: false })]));

test('writes a BOM, a header from the first row and quoted rows with the default options', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'products.csv');
	await scrape(Osmotic.get(site.url()).find('.product').set({ name: 'h2', price: '.price' }).export('csv', file));
	assert.equal(
		readFileSync(file, 'utf8'),
		'﻿name;price\r\n' +
			'Desk lamp, black;499,00\r\n' +
			'"Lamp ""Aurora""";1 299,50\r\n' +
			'"Shelf; oak";899,00\r\n' +
			'"Glödlampa\n2-pack";39,90\r\n',
	);
});

test('objects and arrays are written as JSON, missing values as empty', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'tags.csv');
	await scrape(
		Osmotic.get(site.url())
			.find('.product')
			.set({ name: 'h2', tags: ['.tag'] })
			.export('csv-format-plain', file, { columns: ['name', 'tags', 'missing'] }),
	);
	assert.equal(
		readFileSync(file, 'utf8'),
		'name,tags,missing\r\n' +
			'"Desk lamp, black","[""LED"",""Dimmable""]",\r\n' +
			'"Lamp ""Aurora""","[""LED""]",\r\n' +
			'Shelf; oak,"[""Oak""]",\r\n' +
			'"Glödlampa\n2-pack","[""E27""]",\r\n',
	);
});
