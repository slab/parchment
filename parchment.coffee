_ = require('lodash')
Registry = require('./registry')
Node = require('./node')
Base = require('./base')
Format = require('./format')


class Parchment extends Node
  @Block: Base.Block
  @Embed: Base.Embed
  @Inline: Base.Inline
  @Node: Node

  @scopes: Registry.scopes

  @attach: (node) ->
    Registry.attach(node)

  @compare: (typeName1, typeName2) ->
    Registry.compare(typeName1, typeName2)

  @create: (name, value) ->
    Registry.create(name, value)

  @define: (nodeClass) ->
    Registry.define(nodeClass)

  @match: (node) ->
    Registry.match(node)


Parchment.define(Base.Text)
Parchment.define(Base.Block)
Parchment.define(Base.Inline)
Parchment.define(Base.Break)
Parchment.define(Format.Bold)
Parchment.define(Format.Italic)
Parchment.define(Format.Strike)
Parchment.define(Format.Underline)


module.exports = Parchment
