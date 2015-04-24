_ = require('lodash')
Parchment = require('./parchment')


class Block extends Parchment.Node
  deleteText: (index, length) ->
    if index + length > this.length() && this.next?
      this.mergeNext()
    super
    if children.length == 0
      this.append(Parchment.create('break'))

  formatText: (index, length, name, value) ->
    super
    if index + length > this.length()
      this.format(name, value)

  insertText: (index, text) ->
    lineTexts = text.split('\n')
    super(index, lineTexts[0])
    next = this.next
    lineTexts.slice(1).forEach((lineText) =>
      line = Parchment.create('block')
      line.insertText(0, text)
      this.parent.insertBefore(line, next)
    )

  length: ->
    return super() + 1


class Inline extends Parchment.Node
  deleteText: (index, length) ->
    super
    if children.length == 0
      this.append(Parchment.create('break'))

  formatText: (index, length, name, value) ->
    if (order > true)
      this.split(index, length)
      this.wrap(name, value)
    else
      super(index, length, name, value)


class Leaf extends Inline


class Embed extends Leaf
  formatText: (index, length, name, value) ->
    this.wrap(name, value)


class Text extends Leaf
  constructor: (value) ->
    value = document.createTextNode(value) unless _.isElement(value)
    super(value)

  formatText: (index, length, name, value) ->
    if index != 0 || length != this.length()
      this.split(index, length)
    this.wrap(name, value)

  insertEmbed: (index, name, value) ->
    this.split(index)
    embed = Parchment.create(name, value)
    this.parent.insertBefore(this.next, embed)

  insertText: (index, text) ->
    curText = this.node.textContent
    this.node.textContent = curText.slice(0, index) + text + curText.slice(index)


class Break extends Leaf
  formatText: (index, length, name, value) ->
    this.wrap(name, value)

  insertEmbed: (index, name, value) ->
    this.replace(name, value)

  insertText: (index, text) ->
    this.replace('text', text)



Parchment.define('block', Block)
Parchment.define('break', Break)
Parchment.define('inline', Inline)
Parchment.define('text', Text)


module.exports = Inline
