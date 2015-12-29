"use strict"

let ColorAttributor = new StyleAttributor('color', 'color');
Registry.register(ColorAttributor);

let SizeAttributor = new StyleAttributor('size', 'font-size');
Registry.register(SizeAttributor);

let IdAttributor = new Attributor('id', 'id');
Registry.register(IdAttributor);

let AlignAttributor = new StyleAttributor('align', 'text-align', {
  whitelist: ['right', 'center']  // exclude justify to test valid but missing from whitelist
});
Registry.register(AlignAttributor);

let IndentAttributor = new ClassAttributor('indent', 'indent');
Registry.register(IndentAttributor);
