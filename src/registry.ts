import OrderedMap from './collection/ordered-map';
import ParentBlot from './blot/parent/parent';
import { inherit } from './util';


var tags = {};
var types = new OrderedMap<any>();  // We would specify a class definition if we could


export function compare(typeName1: string, typeName2: string): number {
  return types.indexOf(typeName1) - types.indexOf(typeName2);
};

export function create(name: string, value?:any) {
  var BlotClass = types.get(name);
  if (BlotClass == null) {
    throw new Error(`Unable to create ${name}`);
  }
  return new BlotClass(value, BlotClass);
};

export function define(BlotClass, SuperClass = types.get('parent')) {
  if (typeof BlotClass === 'object') {
    if (BlotClass.nodeName != null) {
      BlotClass = inherit(BlotClass, SuperClass);
    } else {
      var attr = new SuperClass(BlotClass.styleName);
      types.set(BlotClass.attrName, attr);
      return attr;
    }
  }
  // TODO warn of tag/type overwrite
  types.set(BlotClass.nodeName, BlotClass);
  if (typeof BlotClass.tagName === 'string') {
    tags[BlotClass.tagName.toUpperCase()] = BlotClass;
  }
  return BlotClass;
};

export function match(input) {
  if (typeof input === 'string') {
    return types.get(input);
  } else if (input instanceof HTMLElement) {
    return tags[input.tagName];
  } else if (input instanceof Text) {
    return types.get('text');
  } else {
    return null;
  }
};
