import { inherit } from './util';


var tags = {};
var types = {};

export enum Type {
  ATTRIBUTE = 1,
  BLOT = 2
}

export function create(name: string, value?:any) {
  var BlotClass = types[name];
  if (typeof BlotClass !== 'function') {
    throw new Error(`Unable to create ${name}`);
  }
  var obj = new BlotClass(value, BlotClass);
  obj.onCreate(value);
  return obj;
};

export function define(BlotClass, SuperClass = types['parent']) {
  if (typeof BlotClass === 'object') {
    if (BlotClass.blotName != null) {
      BlotClass = inherit(BlotClass, SuperClass);
    } else {
      let attr = new SuperClass(BlotClass.attrName, BlotClass.keyName);
      types[BlotClass.attrName] = attr;
      return attr;
    }
  }
  // TODO warn of tag/type overwrite
  types[BlotClass.blotName] = BlotClass;
  if (typeof BlotClass.tagName === 'string') {
    tags[BlotClass.tagName.toUpperCase()] = BlotClass;
  }
  return BlotClass;
};

export function match(query: string | Node, type?: Type) {
  if (typeof query === 'string') {
    let match = types[query];
    if (match == null || type == null) return match;
    // Check type mismatch
    if ((type === Type.ATTRIBUTE && typeof match.blotName === 'string') ||
        (type === Type.BLOT && typeof match.attrName === 'string')) {
      return null;
    }
  } else if (query instanceof Node && type === Type.BLOT) {
    if (query instanceof HTMLElement) {
      return tags[query.tagName];
    } else if (query instanceof Text) {
      return types['text'];
    }
  }
  return null;
};
