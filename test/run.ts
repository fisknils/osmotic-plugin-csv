import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Osmotic } from 'osmotic';
import csv = require('../src/index.cjs');
import { openSite, scrape, shop, tempDir } from './helpers/index.js';

before(() => Osmotic.plugins([csv]));

const prices = (url: string, file: string) =>
	Osmotic.get(url).find('.product').set({ price: '.price' }).export('csv', file, { bom: false });

test('each run starts the file over', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'prices.csv');
	const chain = prices(site.url(), file);
	await scrape(chain);
	await scrape(chain);
	assert.equal(readFileSync(file, 'utf8'), 'price\r\n499,00\r\n1 299,50\r\n899,00\r\n39,90\r\n');
});

test('a file that cannot be opened fails the run instead of crashing', async (t) => {
	const site = await openSite(t, shop);
	const file = join(tempDir(t), 'missing-dir', 'prices.csv');
	await assert.rejects(scrape(prices(site.url(), file)), /ENOENT/);
});
