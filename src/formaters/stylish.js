import _ from 'lodash';

const replacer = ' ';
const spacesCount = 4;
const getIndent = (depth) => replacer.repeat(depth * spacesCount - 2);
const getBracketIndent = (depth) => replacer.repeat((depth - 1) * spacesCount);

const signs = {
  added: '+ ',
  deleted: '- ',
  unchanged: '  ',
};

export default (tree) => {
  const iter = (currentValue, depth) => {
    if (!_.isPlainObject(currentValue)) {
      return `${currentValue}`;
    }

    const buildedResult = Object
      .entries(currentValue)
      .map(([key, info]) => {
        switch (info.type) {
          case 'added':
          case 'deleted':
          case 'unchanged':
            return `${getIndent(depth)}${signs[info.type]}${key}: ${iter(info.value, depth + 1)}`;
          case 'nested':
            return `${getIndent(depth)}  ${key}: ${iter(info.children, depth + 1)}`;
          case 'changed':
            return `${getIndent(depth)}- ${key}: ${iter(info.value1, depth + 1)}\n${getIndent(depth)}+ ${key}: ${iter(info.value2, depth + 1)}`;
          default:
            return `${getIndent(depth)}  ${key}: ${iter(info.value || info, depth + 1)}`;
        }
      });
    return ['{', ...buildedResult, `${getBracketIndent(depth)}}`].join('\n');
  };

  const result = iter(tree, 1);

  return result;
};
