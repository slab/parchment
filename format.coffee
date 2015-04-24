Inline = require('./base')
Parchment = require('./parchment')


class Bold extends Inline
  @tagName: 'STRONG'


class Italic extends Inline
  @tagName: 'EM'


class Underline extends Inline
  @tagName: 'U'


class Strike extends Inline
  @tagName: 'S'


Parchment.define('bold', Bold)
Parchment.define('italic', Italic)
Parchment.define('underline', Underline)
Parchment.define('strike', Strike)


module.exports = Bold
