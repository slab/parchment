import InlineBlot from '../../../src/blot/inline';

export class AuthorBlot extends InlineBlot {
  static readonly blotName = 'author';
  static className = 'author-blot';
}

export class BoldBlot extends InlineBlot {
  static readonly blotName = 'bold';
  static tagName = 'strong';
}

export class ItalicBlot extends InlineBlot {
  static readonly blotName = 'italic';
  static tagName = 'em';
}

export class ScriptBlot extends InlineBlot {
  static readonly blotName = 'script';
  static tagName = ['sup', 'sub'];
}
