import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

test.each([
  ['json', 'json'],
  ['yaml', 'yaml'],
  ['yml', 'yml'],
  ['json', 'json', 'plain'],
  ['yaml', 'yaml', 'plain'],
  ['yml', 'yml', 'plain'],
  ['json', 'json', 'json'],
  ['yaml', 'yaml', 'json'],
  ['yml', 'yml', 'json'],
])('gendiff', (extension1, extension2, format = 'stylish') => {
  const file1 = getFixturePath(`file1.${extension1}`);
  const file2 = getFixturePath(`file2.${extension2}`);
  const result = fs.readFileSync(getFixturePath(`result.${format}.txt`), 'utf-8');
  expect(genDiff(file1, file2, format)).toEqual(result);
});
