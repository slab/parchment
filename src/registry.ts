import { inherit } from './util';


var tags = {};
var types = {};


export function create(name: string, value?:any) {
  var BlotClass = types[name];
  if (typeof BlotClass !== 'function') {
    throw new Error(`Unable to create ${name}`);
  }
  var obj = new BlotClass(value, BlotClass);
  obj.init(value);
  return obj;
};

export function define(BlotClass, SuperClass = types['parent']) {
  if (typeof BlotClass === 'object') {
    if (BlotClass.nodeName != null) {
      BlotClass = inherit(BlotClass, SuperClass);
    } else {
      var attr = new SuperClass(BlotClass.styleName);
      types[BlotClass.attrName] = attr;
      return attr;
    }
  }
  // TODO warn of tag/type overwrite
  types[BlotClass.nodeName] = BlotClass;
  if (typeof BlotClass.tagName === 'string') {
    tags[BlotClass.tagName.toUpperCase()] = BlotClass;
  }
  return BlotClass;
};

export function match(input: string | Node) {
  if (typeof input === 'string') {
    return types[input];
  } else if (input instanceof HTMLElement) {
    return tags[input.tagName];
  } else if (input instanceof Text) {
    return types['text'];
  } else {
    return null;
  }
};
