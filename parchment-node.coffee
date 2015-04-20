DOMNode = require('./dom-node')


class ParchmentNode extends DOMNode
  constructor: ->

  build: ->

  insertEmbed: (index, name, value) ->
    [child, offset] = children.find(index)
    child.insertEmbed(offset, name, value)

  insertText: (index, text) ->
    [child, offset] = children.find(index)
    child.insertText(offset, text)

  deleteText: (index, length) ->
    this.remove() if index == 0 && length == this.getLength()
    children.forEachAt(index, length, (child, offset, length) =>
      child.deleteText(offset, length)
    )

  formatText: (index, length, name, value) ->
    children.forEachAt(index, length, (child, offset, length) =>
      child.formatText(offset, length, name, value)
    )

  getLength: ->
    return children.reduce((memo, child) ->
      return memo + child.getLength()
    , 0)

  replace: (name, value) ->
    node = Parchment.create(name, value)
    this.attributes.forEach((attribute) =>
      attribute.add(node)
      attribute.remove(this)
    )
    super

  split: (index) ->
    clone = this.clone()
    this.parent.insertBefore(clone, this)
    this.children.forEachAt(0, index, (child, offset, length) ->
      child.remove()
      clone.append(child)
    )

  wrap: (name, value) ->
    node = Parchment.create(name, value)
    this.attributes.forEach((attribute) =>
      attribute.add(node)
      attribute.remove(this)
    )
    super


module.exports = ParchmentNode
