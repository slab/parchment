Inline = require('./base').Inline


class Bold extends Inline
  @nodeName: 'bold'
  @tagName: 'STRONG'


class Italic extends Inline
  @nodeName: 'italic'
  @tagName: 'EM'


class Strike extends Inline
  @nodeName: 'strike'
  @tagName: 'S'


class Underline extends Inline
  @nodeName: 'underline'
  @tagName: 'U'


module.exports =
  Bold: Bold
  Italic: Italic
  Strike: Strike
  Underline: Underline
