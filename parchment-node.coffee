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
    this.remove() if index == 0 && length == this.length()
    children.forEachAt(index, length, (child, offset, length) =>
      child.deleteText(offset, length)
    )

  formatText: (index, length, name, value) ->
    children.forEachAt(index, length, (child, offset, length) =>
      child.formatText(offset, length, name, value)
    )

  replace: (name, value) ->
    node = Parchment.create(name, value)
    this.attributes.forEach((attribute) =>
      attribute.add(node)
      attribute.remove(this)
    )
    super

  split: (index) ->
    return if index == 0 || index == this.length()
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
