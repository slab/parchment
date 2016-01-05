"use strict"

let ColorAttributor = new StyleAttributor('color', 'color', {
  scope: Registry.Scope.INLINE
});
Registry.register(ColorAttributor);

let SizeAttributor = new StyleAttributor('size', 'font-size', {
  scope: Registry.Scope.INLINE
});
Registry.register(SizeAttributor);

let IdAttributor = new Attributor('id', 'id');
Registry.register(IdAttributor);

let AlignAttributor = new StyleAttributor('align', 'text-align', {
  scope: Registry.Scope.BLOCK,
  whitelist: ['right', 'center']  // exclude justify to test valid but missing from whitelist
});
Registry.register(AlignAttributor);

let IndentAttributor = new ClassAttributor('indent', 'indent', {
  scope: Registry.Scope.BLOCK
});
Registry.register(IndentAttributor);
