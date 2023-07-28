import stylish from './stylish.js';

export default (tree, format) => {
  switch (format) {
    case 'stylish':
      return stylish(tree);
    default:
      throw new Error(`Unknown format ${format}`);
  }
};
