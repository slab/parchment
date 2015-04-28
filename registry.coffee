_ = require('lodash')
dom = require('../../lib/dom')
OrderedMap = require('./ordered-map')


class Registry
  @attributes: {}
  @tags: {}
  @types: new OrderedMap()

  @scopes:
    BLOCK: 3
    INLINE: 2
    LEAF: 1

  @attach: (node) ->
    if nodeClass = this.match(node)
      return new nodeClass(node)
    return false

  @compare: (typeName1, typeName2) ->
    type1 = this.types.get(typeName1)
    type2 = this.types.get(typeName2)
    if type1.scope - type2.scope != 0
      return type1 - type2
    else
      return this.types.indexOf(typeName1) - this.types.indexOf(typeName2)

  @create: (name, value) ->
    nodeClass = this.types.get(name)
    return new nodeClass(value)

  @define: (nodeClass) ->
    # TODO warn of tag/type overwrite
    this.types.set(nodeClass.nodeName, nodeClass)
    this.tags[nodeClass.tagName.toUpperCase()] = nodeClass if nodeClass.tagName?

  @match: (node) ->
    if dom(node).isTextNode()
      return this.types.get('text')
    else if dom(node).isElement()
      if node.hasAttribute('data-ql-type')
        return this.types.get(node.getAttribute('data-ql-type'))
      else
        return this.tags[node.tagName]
    else
      return false


module.exports = Registry
