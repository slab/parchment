class BoldBlot extends InlineBlot {}
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'STRONG';

Registry.define(BoldBlot);


class ItalicBlot extends InlineBlot {}
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'em';

Registry.define(ItalicBlot);
