class OrderedMap
  constructor: ->
    @map = {}
    @keys = []

  get: (key) ->
    return @map[key]

  indexOf: (key) ->
    return @keys.indexOf(key)

  length: ->
    return @keys.length

  remove: (key) ->
    return unless @map[key]?
    index = @keys.indexOf(key)
    @keys.splice(index, 1)
    delete @map[key]

  set: (key, value) ->
    @keys.push(key) if !@map[key]?
    @map[key] = value


module.exports = OrderedMap
