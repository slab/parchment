class BoldBlot extends InlineBlot {}
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'STRONG';
Registry.register(BoldBlot);


class ItalicBlot extends InlineBlot {}
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'em';
Registry.register(ItalicBlot);


class ScriptBlot extends InlineBlot {}
ScriptBlot.blotName = 'script';
ScriptBlot.tagName = ['sup', 'sub'];
Registry.register(ScriptBlot);
