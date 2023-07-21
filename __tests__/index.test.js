import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

const expectedResult = fs.readFileSync(getFixturePath('result.txt'), 'utf8');
const file1 = getFixturePath('file1.json');
const file2 = getFixturePath('file2.json');

test('gendiff', () => {
  expect(genDiff(file1, file2)).toEqual(expectedResult);
});
