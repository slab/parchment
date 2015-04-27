class OrderedMap
  constructor: ->
    @map = {}
    @keys = []

  append: (key, value) ->
    this.remove(key)
    @keys.append(key)
    @map[key] = value

  compare: (key1, key2) ->
    return @keys.indexOf(key1) - @keys.indexOf(key2)

  get: (key) ->
    return @map[key]

  insert: (index, key, value) ->
    this.remove(key)
    @keys.splice(index, key)
    @map[key] = value

  length: ->
    return @keys.length

  remove: (key) ->
    return unless @map[key]?
    index = @keys.indexOf(key)
    @keys.splice(index, 1)
    delete @map[key]


module.exports = OrderedMap
