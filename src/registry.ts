import Attributor from './attributor/attributor';

var attributes = {};
var classes = {};
var tags = {};
var types = {};

export enum Type {
  ATTRIBUTE = 1,
  BLOT = 2
}


function camelize(name: string): string {
  if (name.length === 0) return name;
  var parts = name.split('-');
  var rest = parts.slice(1).map(function(part) {
    if (part.length == 0) return part;
    return part[0].toUpperCase() + part.slice(1);
  }).join('');
  return parts[0] + rest;
}


function create(name: Node);
function create(name: string, value?: any);
function create(name: any, value?: any): any {
  var BlotClass = match(name);
  if (typeof BlotClass !== 'function') {
    console.error('Unable to create', name);
    return null;
  }
  if (typeof name === 'string') {
    return new BlotClass(value);
  } else if (name instanceof Node) {
    return new BlotClass(name);
  }
  return null;
}

// Only support real classes since calling superclass definitions are so important
function define(Definition) {
  if (typeof Definition.blotName !== 'string' && typeof Definition.attrName !== 'string') {
    console.error('Invalid definition');
    return null;
  }
  types[Definition.blotName || Definition.attrName] = Definition;
  if (typeof Definition.clasName === 'string') {
    classes[Definition.className] = Definition;
  } else if (typeof Definition.tagName === 'string') {
    tags[Definition.tagName.toUpperCase()] = Definition;
  } else if (typeof Definition.keyName === 'string') {
    attributes[camelize(Definition.keyName)] = Definition;
  }
  return Definition;
}

function match(query: string | Node, type: Type = Type.BLOT) {
  if (typeof query === 'string') {
    if (type === Type.BLOT) {
      return types[query];
    } else {
      let match = types[query] || attributes[camelize(query)];
      // Check type mismatch
      if (match != null && typeof match.blotName === 'string') return null;
      return match;
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
