var ColorAttributor = new StyleAttributor('color', 'color');
Registry.register(ColorAttributor);

var SizeAttributor = new StyleAttributor('size', 'font-size');
Registry.register(SizeAttributor);

var IdAttributor = new Attributor('id', 'id');
Registry.register(IdAttributor);

var AlignAttributor = new StyleAttributor('align', 'text-align');
Registry.register(AlignAttributor);
