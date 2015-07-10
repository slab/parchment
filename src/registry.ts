import { inherit } from './util';


var tags = {};
var types = {};

export enum Type {
  ATTRIBUTE = 1,
  BLOT = 2
}


function create(name: Node);
function create(name: string, value?: any);
function create(name: any, value?: any): any {
  var obj;
  var BlotClass = match(name);
  if (typeof BlotClass !== 'function') {
    console.error(`Unable to create ${name}`);
    return null;
  }
  if (typeof name === 'string') {
    obj = new BlotClass(value, BlotClass);
    obj.onCreate(value);
  } else if (name instanceof Node) {
    obj = new BlotClass(name);
    obj.onCreate(name);
  }
  return obj;
}

function define(BlotClass, SuperClass?) {
  if (typeof BlotClass === 'object') {
    if (typeof BlotClass.blotName === 'string') {
      return defineBlotObject(BlotClass, SuperClass);
    } else {
      return defineAttrObject(BlotClass, SuperClass);
    }
  } else {
    return defineBlotClass(BlotClass)
  }
}

function defineAttrObject(AttrObject, SuperClass) {
  return types[AttrObject.attrName] = new SuperClass(AttrObject.attrName, AttrObject.keyName);
}

function defineBlotClass(BlotClass) {
  // TODO warn of tag/type overwrite
  types[BlotClass.blotName] = BlotClass;
  if (typeof BlotClass.tagName === 'string') {
    tags[BlotClass.tagName.toUpperCase()] = BlotClass;
  }
  return BlotClass;
}

function defineBlotObject(BlotObject, SuperClass = types['parent']) {
  var BlotClass = inherit(BlotObject, SuperClass);
  return defineBlotClass(BlotClass);
}

function match(query: string | Node, type: Type = Type.BLOT) {
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
}

export { create, define, match };
