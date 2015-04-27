_ = require('lodash')
TreeList = require('./tree-list')


class ParchmentNode
  @tagName: 'DIV'

  constructor: (@domNode) ->
    @domNode = document.createElement(this.constructor.tagName) unless @domNode?.nodeType?
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

  insertBefore: (childNode, refNode) ->
    @children = new TreeList() unless @children?
    @children.insertBefore(childNode, refNode)
    refDomNode = if refNode? then refNode.domNode else null
    if !childNode.next? || childNode.domNode.nextSibling != refDomNode
      @domNode.insertBefore(childNode.domNode, refDomNode)
    childNode.parent = this

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

  clone: ->
    domNode = @domNode.cloneNode()
    return new this.constructor(domNode)

  split: (index) ->
    return this if index == 0
    return @next if index == this.length()
    after = this.clone()
    @parent.insertBefore(after, @next)
    if @children?
      @children.forEachAt(index, this.length(), (child, offset, length) ->
        child = child.split(offset) if offset != 0
        child.remove()
        after.append(child)
      )
    return after

  wrap: (name, value) ->
    other = Parchment.create(name, value)
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
    return new Parchment.types[name](value)

  @define: (name, nodeClass) ->
    # TODO warn of tag/type overwrite
    Parchment.types[name] = nodeClass
    Parchment.tags[nodeClass.tagName.toUpperCase()] = nodeClass if nodeClass.tagName?

  @match: (node) ->
    switch node.nodeType
      when node.ELEMENT_NODE
        if node.hasAttribute('data-ql-type')
          return Parchment.types[node.getAttribute('data-ql-type')]
        else
          return Parchment.tags[node.tagName]
      when node.TEXT_NODE then return Parchment.types['text']
      else return false


module.exports = Parchment
