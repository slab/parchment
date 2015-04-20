ParchmentNode = require('./parchment-node')


class Parchment extends ParchmentNode
  @Node: ParchmentNode

  @create: (name, value) ->
    # Create both ParchmentNode and parallel DOM node

  @define: (nodeClass) ->




class Block extends ParchmentNode
  formatText: (index, length, name, value) ->
    super
    if index + length > this.getLength()
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

  deleteText: (index, length) ->
    if index + length > this.getLength() && this.next?
      this.mergeNext()
    super
    if children.length == 0
      this.append(Parchment.create('break'))

  getLength: ->
    return super() + 1


class Inline
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
  formatText: (index, length, name, value) ->
    if index != 0 || length != this.getLength()
      this.split(index, length)
    this.wrap(name, value)

  insertText: (index, text) ->
    curText = this.node.textContent
    this.node.textContent = curText.slice(0, index) + text + curText.slice(index)

  insertEmbed: (index, name, value) ->
    this.split(index)
    embed = Parchment.create(name, value)
    this.parent.insertBefore(this.next, embed)


class Break extends Leaf
  formatText: (index, length, name, value) ->
    this.wrap(name, value)

  insertEmbed: (index, name, value) ->
    this.replace(name, value)

  insertText: (index, text) ->
    this.replace('text', text)



Parchment.define()



module.exports = Parchment
