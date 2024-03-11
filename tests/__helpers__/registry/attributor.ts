import Attributor from '../../../src/attributor/attributor.js';
import ClassAttributor from '../../../src/attributor/class.js';
import StyleAttributor from '../../../src/attributor/style.js';
import Scope from '../../../src/scope.js';

export const Color = new StyleAttributor('color', 'color', {
  scope: Scope.INLINE_ATTRIBUTE,
});

export const Size = new StyleAttributor('size', 'font-size', {
  scope: Scope.INLINE_ATTRIBUTE,
});

export const Family = new StyleAttributor('family', 'font-family', {
  scope: Scope.INLINE_ATTRIBUTE,
  whitelist: ['Arial', 'Times New Roman'],
});

export const Id = new Attributor('id', 'id');

export const Align = new StyleAttributor('align', 'text-align', {
  scope: Scope.BLOCK_ATTRIBUTE,
  whitelist: ['right', 'center'], // exclude justify to test valid but missing from whitelist
});

export const Indent = new ClassAttributor('indent', 'indent', {
  scope: Scope.BLOCK_ATTRIBUTE,
});
