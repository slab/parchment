class TreeNode
  constructor: ->
    @prev = @next = @parent = null
    @children = null

  length: ->
    return 1

  append: (node) ->
    this.insertBefore(node, null)

  insertBefore: (node, refNode) ->
    @children = new LinkedList() unless @children?
    @children.insertBefore(node, refNode)
    node.parent = this

  remove: ->
    return unless @parent?.children?
    @parent.children.remove(this)
    @parent = @prev = @next = null

  replace: (node) ->
    return unless @parent?.children?
    @parent.children.insertBefore(node, this)
    this.remove()

  wrap: (node) ->
    this.replace(node)
    node.append(this)   # node should have no children
    @parent = node


module.exports = TreeNode
