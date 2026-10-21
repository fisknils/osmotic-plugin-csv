// ESM entry: re-exports the CommonJS build, so import and require share one plugin
import csv from './index.cjs';

export default csv;
export type { CsvOptions, CsvPluginOptions } from './types.js';
