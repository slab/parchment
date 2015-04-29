_ = require('lodash')
dom = require('../../lib/dom')
Node = require('./node')
Registry = require('./registry')


class Block extends Node
  @nodeName: 'block'
  @tagName: 'P'
  @scope: Registry.scopes.BLOCK

  deleteText: (index, length) ->
    if index + length > this.length() && this.next?
      this.mergeNext()
    super
    if children.length == 0
      this.append(Registry.create('break'))

  formatText: (index, length, name, value) ->
    super
    if index + length > this.length()
      this.format(name, value)

  insertText: (index, text) ->
    lineTexts = text.split('\n')
    super(index, lineTexts[0])
    next = this.next
    lineTexts.slice(1).forEach((lineText) =>
      line = Registry.create('block')
      line.insertText(0, text)
      this.parent.insertBefore(line, next)
    )


class Inline extends Node
  @nodeName: 'inline'
  @tagName: 'SPAN'
  @scope: Registry.scopes.INLINE

  constructor: (node) ->
    node = undefined unless node?.nodeType?
    super(node)

  deleteText: (index, length) ->
    super
    if children.length == 0
      this.append(Registry.create('break'))

  formatText: (index, length, name, value) ->
    if Registry.compare(this.constructor.nodeName, name) < 0 && !!value
      target = this.isolate()
      target.wrap(name, value)
    else
      super


class Leaf extends Inline
  @nodeName: 'leaf'
  @scope: Registry.scopes.LEAF


class Embed extends Leaf
  @nodeName: 'embed'

  length: ->
    return 1

  formatText: (index, length, name, value) ->
    this.wrap(name, value)


class Text extends Leaf
  @nodeName: 'text'

  constructor: (value) ->
    value = document.createTextNode(value) if _.isString(value)
    super(value)

  length: ->
    return dom(@domNode).text().length

  split: (index) ->
    return this if index == 0
    return @next if index == this.length()
    after = new this.constructor(@domNode.splitText(index))
    @parent.insertBefore(after, @next)
    return after

  formatText: (index, length, name, value) ->
    target = this.split(index)
    target.split(length)
    target.wrap(name, value)

  insertEmbed: (index, name, value) ->
    this.split(index)
    embed = Registry.create(name, value)
    this.parent.insertBefore(this.next, embed)

  insertText: (index, text) ->
    curText = dom(@domNode).text()
    dom(@domNode).text(curText.slice(0, index) + text + curText.slice(index))


class Break extends Leaf
  @nodeName: 'break'
  @tagName: 'BR'

  formatText: (index, length, name, value) ->
    this.wrap(name, value)

  insertEmbed: (index, name, value) ->
    this.replace(name, value)

  insertText: (index, text) ->
    this.replace('text', text)


module.exports =
  Block: Block
  Break: Break
  Embed: Embed
  Inline: Inline
  Leaf: Leaf
  Text: Text
