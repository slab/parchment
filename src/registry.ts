import OrderedMap from './collection/ordered-map';


var attributes = {};
var tags = {};
var types = new OrderedMap<any>();


export enum Scope {
  CONTAINER = 4,
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
  var BlotClass = types.get(name);
  if (BlotClass == null) {
    throw new Error(`Unable to create ${name}`);
  }
  return new BlotClass(value, BlotClass);
};

export function define(BlotClass) {
  // TODO warn of tag/type overwrite
  types.set(BlotClass.nodeName, BlotClass);
  if (typeof BlotClass.tagName === 'string') {
    tags[BlotClass.tagName.toUpperCase()] = BlotClass;
  }
  return BlotClass;
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
