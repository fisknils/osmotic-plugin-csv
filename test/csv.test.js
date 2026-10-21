const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { Osmotic } = require('osmotic');
const csv = require('..');

const page = `<ul>
	<li><b>apple</b> <i>1,5</i></li>
	<li><b>say "hi"</b> <i>2</i></li>
	<li><b>multi
line</b> <i>3;4</i></li>
</ul>`;

let server;
let url;
let dir;

before(async () => {
	server = http.createServer((req, res) => {
		res.setHeader('content-type', 'text/html');
		res.end(page);
	});
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
	url = `http://127.0.0.1:${server.address().port}/`;
	dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osmotic-plugin-csv-'));
	Osmotic.plugins([csv, csv({ type: 'csv-plain', delimiter: ',', bom: false })]);
});

after(() => {
	server.close();
	fs.rmSync(dir, { recursive: true, force: true });
});

const file = (name) => path.join(dir, name);
const read = (name) => fs.readFileSync(file(name), 'utf8');

// A chain over the three list items, exporting with the given type and options
const chain = (type, name, options) =>
	Osmotic.get(url)
		.config({ respectRobots: false })
		.find('li')
		.set({ name: 'b', n: 'i' })
		.export(type, file(name), options);

test('writes a BOM, a header and quoted rows with the default options', async () => {
	await chain('csv', 'default.csv').run();
	assert.equal(read('default.csv'), '﻿name;n\r\napple;1,5\r\n"say ""hi""";2\r\n"multi\nline";"3;4"\r\n');
});

test('options passed to export() apply to that file', async () => {
	await chain('csv', 'plain.csv', { delimiter: ',', bom: false, columns: ['n'] }).run();
	assert.equal(read('plain.csv'), 'n\r\n"1,5"\r\n2\r\n3;4\r\n');
});

test('a second type carries its own defaults', async () => {
	await chain('csv-plain', 'second.csv').run();
	assert.equal(read('second.csv'), 'name,n\r\napple,"1,5"\r\n"say ""hi""",2\r\n"multi\nline",3;4\r\n');
});

test('objects and arrays are written as JSON, missing values as empty', async () => {
	await Osmotic.get(url)
		.config({ respectRobots: false })
		.set({ items: ['b'] })
		.export('csv-plain', file('json.csv'), { columns: ['items', 'missing'] })
		.run();
	assert.equal(read('json.csv'), 'items,missing\r\n"[""apple"",""say \\""hi\\"""",""multi\\nline""]",\r\n');
});

test('each run starts the file over', async () => {
	const c = chain('csv', 'twice.csv');
	await c.run();
	await c.run();
	assert.equal(read('twice.csv').split('\r\n').length, 5); // Header, three rows, trailing newline
});

test('a file that cannot be opened fails the run instead of crashing', async () => {
	await assert.rejects(chain('csv', path.join('missing-dir', 'x.csv')).run(), /ENOENT/);
});
