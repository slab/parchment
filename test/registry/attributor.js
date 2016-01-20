"use strict"

let ColorAttributor = new StyleAttributor('color', 'color', {
  scope: Registry.Scope.INLINE_ATTRIBUTE
});
Registry.register(ColorAttributor);

let SizeAttributor = new StyleAttributor('size', 'font-size', {
  scope: Registry.Scope.INLINE_ATTRIBUTE
});
Registry.register(SizeAttributor);

let IdAttributor = new Attributor('id', 'id');
Registry.register(IdAttributor);

let AlignAttributor = new StyleAttributor('align', 'text-align', {
  scope: Registry.Scope.BLOCK_ATTRIBUTE,
  whitelist: ['right', 'center']  // exclude justify to test valid but missing from whitelist
});
Registry.register(AlignAttributor);

let IndentAttributor = new ClassAttributor('indent', 'indent', {
  scope: Registry.Scope.BLOCK_ATTRIBUTE
});
Registry.register(IndentAttributor);
