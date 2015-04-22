class DOMNode
  constructor: (@node) ->
    @prev = @next = @parent = undefined
    @children = undefined

  length: ->
    return 0 unless @children?
    return @children.reduce((memo, child) ->
      return memo + child.length()
    , 0)

  append: (other) ->
    this.insertBefore(other, undefined)

  insertBefore: (other, refNode) ->
    @children = new LinkedList() unless @children?
    @children.insertBefore(other, refNode)
    @node.insertBefore(other.node, refNode?.node)
    other.parent = this

  remove: ->
    return unless @parent?.children?
    @parent.children.remove(this)
    @node.parentNode.removeChild(@node)
    @parent = @prev = @next = undefined

  replace: (other) ->
    return unless @parent?
    @parent.insertBefore(other, this)
    @children.forEach((child) ->
      other.append(child)
      other.node.appendChild(child.node)
    )
    this.remove()

  wrap: (other) ->
    @parent.insertBefore(other, this)
    this.remove()
    other.append(this)
    @parent = node


module.exports = DOMNode
