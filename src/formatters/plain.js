import _ from 'lodash';

const convert = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  return _.isString(value) ? `'${value}'` : `${value}`;
};

export default (tree) => {
  const iter = (currentValue, parentName = '') => {
    const buildedResult = Object
      .entries(currentValue)
      .flatMap(([key, info]) => {
        switch (info.type) {
          case 'added':
            return `Property '${parentName}${key}' was added with value: ${convert(info.value)}`;
          case 'deleted':
            return `Property '${parentName}${key}' was removed`;
          case 'changed':
            return `Property '${parentName}${key}' was updated. From ${convert(info.value1)} to ${convert(info.value2)}`;
          case 'nested':
            return iter(info.children, `${parentName}${key}.`);
          default:
            return [];
        }
      });
    return [...buildedResult].join('\n');
  };
  return iter(tree);
};
