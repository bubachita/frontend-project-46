import _ from 'lodash';
import { load } from 'js-yaml';
import fs from 'fs';
import path from 'path';

const getAbsolutePath = (filepath) => path.resolve(process.cwd(), filepath);
const getData = (absolutePath) => fs.readFileSync(absolutePath);
const getExtension = (absolutePath) => path.extname(absolutePath).slice(1);
const parse = (data, extension) => {
    switch(extension) {
        case 'json':
            return JSON.parse(data);
        case 'yaml':
        case 'yml':
            return load(data);
    };
};

const buildTree = (data1, data2) => {
    const keys1 = _.keys(data1);
    const keys2 = _.keys(data2);
    const sortedKeys = _.sortBy(_.union(keys1, keys2));

    const tree = sortedKeys.map((key) => {
        if(!_.has(data1, key)) {
            return [key, {type: 'added', value: data2[key]}];
        }
        if(!_.has(data2, key)) {
            return [key, {type: 'deleted', value: data1[key]}];
        }
        if(data1[key] === data2[key]) {
            return [key, {type: 'unchanged', value: data1[key]}];
        }
        if(data1[key] !== data2[key]) {
            return [key, {type: 'changed', value1: data1[key], value2: data2[key]}];
        }
    });
    return tree;
};

export default (filepath1, filepath2) => {
    const path1 = getAbsolutePath(filepath1);
    const path2 = getAbsolutePath(filepath2);
    const data1 = parse(getData(path1), getExtension(path1));
    const data2 = parse(getData(path2), getExtension(path2));

    const tree = buildTree(data1, data2);
    const result = tree.map(([key, info]) => {
        const signs = {
            added: '+',
            deleted: '-',
            unchanged: ' ',        
        }
        switch(info.type) {
            case 'added':
            case 'deleted':
            case 'unchanged':
                return `  ${signs[info.type]} ${key}: ${info.value}`;
            case 'changed':
                return `  - ${key}: ${info.value1}\n  + ${key}: ${info.value2}`;
        }
    }); 
    result.unshift('{');
    result.push('}');

    console.log(result.join('\n'));
  };