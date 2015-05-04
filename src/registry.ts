import OrderedMap = require('./lib/ordered-map');


var attributes = {};
var tags = {};
var types = new OrderedMap();

export enum Scope {
  BLOCK = 3,
  INLINE = 2,
  LEAF = 1
};

export function attach(node) {
  var nodeClass = match(node);
  if (nodeClass) {
    return new nodeClass(node);
  }
  return false;
};

export function compare(typeName1: string, typeName2: string): number {
  var type1 = types.get(typeName1);
  var type2 = types.get(typeName2);
  if (type1.scope != type2.scope) {
    return type1.scope - type2.scope;
  } else {
    return types.indexOf(typeName1) - types.indexOf(typeName2)
  }
};

export function create(name: string, value?) {
  var nodeClass = types.get(name);
  var instance = new nodeClass(value);
  instance.class = nodeClass;
  return instance;
};

export function define(nodeClass) {
  // TODO warn of tag/type overwrite
  types.set(nodeClass.nodeName, nodeClass);
  if (!!nodeClass.tagName) {
    tags[nodeClass.tagName.toUpperCase()] = nodeClass;
  }
};

export function match(node) {
  if (typeof node === "Text") {
    return types.get('text');
  } else if (typeof node === "HTMLElement") {
    return tags[node.tagName];
  } else {
    return null;
  }
};
