_ = require('lodash')
Registry = require('./registry')
TreeList = require('./tree-list')


class Node
  @nodeName: 'node'
  @scope: Registry.scopes.BLOCK

  constructor: (@domNode) ->
    @domNode = document.createElement(this.constructor.tagName) unless @domNode?.nodeType?
    @prev = @next = @parent = undefined
    @children = new TreeList()
    this.build()

  build: ->
    _.map(@domNode.childNodes).forEach((node) =>
      child = Registry.attach(node)
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

  insertBefore: (childNode, refNode) ->
    @children.insertBefore(childNode, refNode)
    refDomNode = if refNode? then refNode.domNode else null
    if !childNode.next? || childNode.domNode.nextSibling != refDomNode
      @domNode.insertBefore(childNode.domNode, refDomNode)
    childNode.parent = this

  remove: ->
    @parent.children.remove(this)
    @domNode.parentNode.removeChild(@domNode)
    @parent = @prev = @next = undefined

  replace: (name, value) ->
    return unless @parent?
    other = Registry.create(name, value)
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

  clone: ->
    domNode = @domNode.cloneNode()
    return new this.constructor(domNode)

  split: (index) ->
    return this if index == 0
    return @next if index == this.length()
    after = this.clone()
    @parent.insertBefore(after, @next)
    @children.forEachAt(index, this.length(), (child, offset, length) ->
      child = child.split(offset) if offset != 0
      child.remove()
      after.append(child)
    )
    return after

  wrap: (name, value) ->
    other = Registry.create(name, value)
    # @attributes.forEach((attribute) =>
    #   attribute.add(other)
    #   attribute.remove(this)
    # )
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


module.exports = Node
