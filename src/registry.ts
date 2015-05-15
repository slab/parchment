import OrderedMap = require('./lib/ordered-map');


var attributes = {};
var tags = {};
var types = new OrderedMap();

export enum Scope {
  BLOCK = 3,
  INLINE = 2,
  LEAF = 1
};

export function compare(typeName1: string, typeName2: string): number {
  var type1 = types.get(typeName1);
  var type2 = types.get(typeName2);
  if (type1.scope !== type2.scope) {
    return type1.scope - type2.scope;
  } else {
    return types.indexOf(typeName1) - types.indexOf(typeName2);
  }
};

export function create(name: string, value?:any) {
  var NodeClass = types.get(name);
  if (NodeClass == null) {
    throw new Error(`Unable to create ${name}`);
  }
  return new NodeClass(value, NodeClass);
};

export function define(NodeClass) {
  // TODO warn of tag/type overwrite
  types.set(NodeClass.nodeName, NodeClass);
  if (typeof NodeClass.tagName === 'string') {
    tags[NodeClass.tagName.toUpperCase()] = NodeClass;
  }
  return NodeClass;
};

export function match(node) {
  if (node instanceof Text) {
    return types.get('text');
  } else if (node instanceof HTMLElement) {
    return tags[node.tagName];
  } else {
    return null;
  }
};
