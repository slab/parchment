import InlineBlot from '../../src/blot/inline';

export class AuthorBlot extends InlineBlot {}
AuthorBlot.blotName = 'author';
AuthorBlot.className = 'author-blot';

export class BoldBlot extends InlineBlot {}
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'STRONG';

export class ItalicBlot extends InlineBlot {}
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'em';

export class ScriptBlot extends InlineBlot {}
ScriptBlot.blotName = 'script';
ScriptBlot.tagName = ['sup', 'sub'];
