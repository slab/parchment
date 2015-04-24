_ = require('lodash')
TreeList = require('./tree-list')


class ParchmentNode
  @tagName: 'DIV'

  constructor: (@domNode) ->
    @domNode = document.createElement(this.constructor.tagName) unless @domNode?
    @prev = @next = @parent = undefined
    @children = undefined
    this.build()

  build: ->
    _.map(@domNode.childNodes).forEach((node) =>
      child = Parchment.attach(node)
      if child
        this.append(child)
      else
        node.parentNode.removeChild(node)
    )

  length: ->
    return 0 unless @children?
    return @children.reduce((memo, child) ->
      return memo + child.length()
    , 0)

  append: (other) ->
    this.insertBefore(other, undefined)

  insertBefore: (other, refNode) ->
    @children = new TreeList() unless @children?
    @children.insertBefore(other, refNode)
    @domNode.insertBefore(other.domNode, refNode?.domNode) unless other.domNode.nextSibling == refNode?.domNode
    other.parent = this

  remove: ->
    return unless @parent?.children?
    @parent.children.remove(this)
    @domNode.parentNode.removeChild(@domNode)
    @parent = @prev = @next = undefined

  replace: (name, value) ->
    return unless @parent?
    other = Parchment.create(name, value)
    @parent.insertBefore(other, this)
    @children.forEach((child) ->
      other.append(child)
      other.domNode.appendChild(child.domNode)
    )
    # @attributes.forEach((attribute) =>
    #   attribute.add(other)
    #   attribute.remove(this)
    # )
    this.remove()

  split: (index) ->
    return if index == 0 || index == this.length()
    clone = this.clone()
    @parent.insertBefore(clone, this)
    @children.forEachAt(0, index, (child, offset, length) ->
      child.remove()
      clone.append(child)
    )

  wrap: (name, value) ->
    other = Parchment.create(name, value)
    this.attributes.forEach((attribute) =>
      attribute.add(other)
      attribute.remove(this)
    )
    @parent.insertBefore(other, this)
    this.remove()
    other.append(this)
    @parent = other


  deleteText: (index, length) ->
    this.remove() if index == 0 && length == this.length()
    @children.forEachAt(index, length, (child, offset, length) =>
      child.deleteText(offset, length)
    )

  formatText: (index, length, name, value) ->
    @children.forEachAt(index, length, (child, offset, length) =>
      child.formatText(offset, length, name, value)
    )

  insertEmbed: (index, name, value) ->
    [child, offset] = @children.find(index)
    child.insertEmbed(offset, name, value)

  insertText: (index, text) ->
    [child, offset] = @children.find(index)
    child.insertText(offset, text)


class Parchment extends ParchmentNode
  @Node: ParchmentNode

  @tags: {}
  @types: {}

  # Create new ParchmentNode matching existing dom node
  @attach: (node) ->
    if c = this.match(node)
      return new c(node)
    return false

  @create: (name, value) ->
    return Parchment.types[name].create(value)

  @define: (name, nodeClass) ->
    # TODO warn of tag/type overwrite
    Parchment.types[name] = nodeClass
    Parchment.tags[nodeClass.tagName.toUpperCase()] = nodeClass if nodeClass.tagName?

  @match: (node) ->
    switch node.nodeType
      when node.ELEMENT_NODE then return Parchment.tags[node.tagName]
      when node.TEXT_NODE then return Parchment.types['text']
      else return false


module.exports = Parchment
