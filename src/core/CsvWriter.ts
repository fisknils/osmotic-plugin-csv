import { createWriteStream, type WriteStream } from 'node:fs';
import type { Data, Exporter } from 'osmotic';
import type { CsvOptions } from '../types/options.js';

// CSV file written one row at a time. osmotic creates it on the first row of a run;
// the header comes from the columns option or that row's keys.
export class CsvWriter implements Exporter {
	private readonly stream: WriteStream;
	private readonly delimiter: string;
	private columns: string[] | null;
	private headerWritten = false;
	private warned = false;
	private error: Error | null = null;

	constructor(
		private readonly file: string,
		{ columns = null, delimiter = ';', bom = true }: CsvOptions,
	) {
		this.columns = columns;
		this.delimiter = delimiter;
		this.stream = createWriteStream(file, { encoding: 'utf8' });
		// Unhandled, a failed open would crash the process; write() and end() report it instead
		this.stream.on('error', (err) => (this.error ??= err));
		if (bom) this.stream.write('﻿');
	}

	write(data: Data): void {
		if (this.error) throw this.error;
		if (!this.columns) this.columns = Object.keys(data);
		if (!this.headerWritten) {
			this.stream.write(this.line(this.columns));
			this.headerWritten = true;
		}
		if (!this.warned) {
			const extra = Object.keys(data).filter((k) => !this.columns!.includes(k));
			if (extra.length) {
				console.warn(`${this.file}: ignoring field(s) not in columns: ${extra.join(', ')}`);
				this.warned = true;
			}
		}
		this.stream.write(this.line(this.columns.map((c) => data[c])));
	}

	end(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.error) return reject(this.error); // A stream that failed to open never finishes
			this.stream.once('error', reject);
			this.stream.end((err?: Error | null) => ((err ?? this.error) ? reject(err ?? this.error) : resolve()));
		});
	}

	private line(values: unknown[]): string {
		return (
			values
				.map((v) => {
					if (v == null) return '';
					const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
					return /["\r\n]/.test(s) || s.includes(this.delimiter) ? `"${s.replaceAll('"', '""')}"` : s;
				})
				.join(this.delimiter) + '\r\n'
		);
	}
}
