import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import formatter from './formatters/index.js';

const getAbsolutePath = (filepath) => path.resolve(process.cwd(), filepath);
const getData = (absolutePath) => fs.readFileSync(absolutePath);
const getExtension = (absolutePath) => path.extname(absolutePath).slice(1);

const buildTree = (data1, data2) => {
  const keys1 = _.keys(data1);
  const keys2 = _.keys(data2);
  const sortedKeys = _.sortBy(_.union(keys1, keys2));

  const tree = sortedKeys.map((key) => {
    if (!_.has(data1, key)) {
      return [key, { type: 'added', value: data2[key] }];
    }
    if (!_.has(data2, key)) {
      return [key, { type: 'deleted', value: data1[key] }];
    }
    if (_.isPlainObject(data1[key]) && _.isPlainObject(data2[key])) {
      return [key, { type: 'nested', children: buildTree(data1[key], data2[key]) }];
    }
    if (data1[key] !== data2[key]) {
      return [key, { type: 'changed', value1: data1[key], value2: data2[key] }];
    }
    return [key, { type: 'unchanged', value: data1[key] }];
  });
  return _.fromPairs(tree);
};

export default (filepath1, filepath2, format = 'stylish') => {
  const path1 = getAbsolutePath(filepath1);
  const path2 = getAbsolutePath(filepath2);
  const data1 = parse(getData(path1), getExtension(path1));
  const data2 = parse(getData(path2), getExtension(path2));

  const tree = buildTree(data1, data2);
  const result = formatter(tree, format);
  return result;
};
