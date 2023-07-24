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
])('gendiff', (extension1, extension2) => {
  const file1 = getFixturePath(`file1.${extension1}`);
  const file2 = getFixturePath(`file2.${extension2}`);
  const result = fs.readFileSync(getFixturePath(`result.${extension1}.txt`), 'utf8');
  expect(genDiff(file1, file2)).toEqual(result);
});
