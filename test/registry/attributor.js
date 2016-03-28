"use strict"

let Color = new StyleAttributor('color', 'color', {
  scope: Registry.Scope.INLINE_ATTRIBUTE
});

let Size = new StyleAttributor('size', 'font-size', {
  scope: Registry.Scope.INLINE_ATTRIBUTE
});

let Id = new Attributor('id', 'id');

let Align = new StyleAttributor('align', 'text-align', {
  scope: Registry.Scope.BLOCK_ATTRIBUTE,
  whitelist: ['right', 'center']  // exclude justify to test valid but missing from whitelist
});

let Indent = new ClassAttributor('indent', 'indent', {
  scope: Registry.Scope.BLOCK_ATTRIBUTE
});


Registry.register(Color, Size, Id, Align, Indent);
