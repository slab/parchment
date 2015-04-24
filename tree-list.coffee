class TreeList
  constructor: ->
    @head = @tail = undefined
    @length = 0

  append: (nodes...) ->
    this.insertBefore(nodes[0], undefined)
    this.append(nodes.slice(1)...) if nodes.length > 1

  insertBefore: (node, refNode) ->
    node.next = refNode
    if refNode?
      node.prev = refNode.prev
      refNode.prev.next = node if refNode.prev?
      refNode.prev = node
      @head = node if refNode == @head
    else if @tail?
      @tail.next = node
      node.prev = @tail
      @tail = node
    else
      @head = @tail = node
    @length += 1

  remove: (node) ->
    node.prev.next = node.next if node.prev?
    node.next.prev = node.prev if node.next?
    @head = node.next if node == @head
    @tail = node.prev if node == @tail
    node.prev = node.next = undefined
    @length -= 1

  iterator: (startNode) ->
    cur = startNode || @head
    # TODO use yield with ES6
    return ->
      ret = cur
      cur = cur.next if cur?
      return ret

  find: (index) ->
    next = this.iterator()
    while cur = next()
      length = cur.length()
      return [cur, index] if index < length
      index -= length
    return false

  forEach: (callback) ->
    next = this.iterator()
    while cur = next()
      callback(cur)

  forEachAt: (index, length, callback) ->
    # TODO use this.find()
    next = this.iterator()
    curIndex = 0
    while cur = next()
      break unless curIndex < index + length
      curLength = cur.length()
      if index <= curIndex
        callback(0, Math.min(curLength, index + length - curIndex), cur)
      else if index < curIndex + curLength
        callback(index - curIndex, Math.min(length, curIndex + curLength - index), cur)
      curIndex += curLength

  reduce: (callback, memo) ->
    next = this.iterator()
    while cur = next()
      memo = callback(memo, cur)
    return memo


module.exports = TreeList
