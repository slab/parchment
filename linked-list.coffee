class LinkedList
  constructor: ->
    @head = @tail = null
    @length = 0

  append: (node) ->
    this.insertBefore(node, null)

  insertBefore: (node, refNode) ->
    node.next = refNode
    if refNode?
      node.prev = refNode.prev
      refNode.prev.next = node if refNode.prev?
      refNode.prev = node
      node = @head if refNode == @head
    else if @tail?
      @tail.next = node
      @tail = node
    else
      @head = @tail = node
    @length += 1

  remove: (node) ->
    node.prev.next = node.next if node.prev?
    node.next.prev = node.prev if node.next?
    @head = node.next if node == @head
    @tail = node.prev if node == @tail
    node.prev = node.next = null
    @length -= 1

  forEach: (callback) ->
    cur = @head
    while cur?
      next = cur.next
      callback(cur)
      cur = next

  forEachAt: (index, length, callback) ->
    curNode = @head
    curIndex = 0
    while cur? && curIndex <= index + length
      next = cur.next
      curLength = cur.length()
      if curIndex <= index && index <= curIndex + curLength
        callback(cur, index - curIndex, curLength)
      cur = next
      curIndex += curLength

  reduce: (callback, memo) ->
    cur = @head
    while cur?
      next = cur.next
      memo = callback(memo, cur)
      cur = next


module.exports = LinkedList
