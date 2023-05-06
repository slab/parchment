'use strict';

class AuthorBlot extends InlineBlot {}
AuthorBlot.blotName = 'author';
AuthorBlot.className = 'author-blot';

class BoldBlot extends InlineBlot {}
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'STRONG';

class ItalicBlot extends InlineBlot {}
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'em';

class ScriptBlot extends InlineBlot {}
ScriptBlot.blotName = 'script';
ScriptBlot.tagName = ['sup', 'sub'];

TestRegistry.register(AuthorBlot, BoldBlot, ItalicBlot, ScriptBlot);
