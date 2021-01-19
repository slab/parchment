'use strict';

let Color = new StyleAttributor('color', 'color', {
  scope: Scope.INLINE_ATTRIBUTE,
});

let Size = new StyleAttributor('size', 'font-size', {
  scope: Scope.INLINE_ATTRIBUTE,
});

let Family = new StyleAttributor('family', 'font-family', {
  scope: Scope.INLINE_ATTRIBUTE,
  whitelist: ['Arial', 'Times New Roman'],
});

let Id = new Attributor('id', 'id');

let Align = new StyleAttributor('align', 'text-align', {
  scope: Scope.BLOCK_ATTRIBUTE,
  whitelist: ['right', 'center'], // exclude justify to test valid but missing from whitelist
});

let Indent = new ClassAttributor('indent', 'indent', {
  scope: Scope.BLOCK_ATTRIBUTE,
});

TestRegistry.register(Color, Size, Family, Id, Align, Indent);
