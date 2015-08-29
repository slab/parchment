import Attributor from './attributor/attributor';

var attributes = {};
var classes = {};
var tags = {};
var types = {};

export const PREFIX = 'blot-';

export enum Type {
  ATTRIBUTE = 1,
  BLOT = 2
}


function create(name: Node);
function create(name: string, value?: any);
function create(name: any, value?: any): any {
  var BlotClass = match(name, Type.BLOT);
  if (typeof BlotClass !== 'function') {
    throw new Error(`[Parchment] Unable to create ${name}`);
  }
  if (typeof name === 'string') {
    return new BlotClass(value);
  } else {
    return new BlotClass(name);
  }
}

// Only support real classes since calling superclass definitions are so important
function define(Definition) {
  if (typeof Definition.blotName !== 'string' && typeof Definition.attrName !== 'string') {
    throw new Error('[Parchment] Invalid definition');
  }
  types[Definition.blotName || Definition.attrName] = Definition;
  if (typeof Definition.tagName === 'string') {
    tags[Definition.tagName.toUpperCase()] = Definition;
  } else if (Array.isArray(Definition.tagName)) {
    Definition.tagName.forEach(function(tag) {
      tags[tag.toUpperCase()] = Definition;
    });
  } else if (typeof Definition.keyName === 'string') {
    attributes[Definition.keyName] = Definition;
  }
  return Definition;
}

function match(query: string | Node, type: Type = Type.BLOT) {
  if (typeof query === 'string') {
    if (type === Type.BLOT) {
      return types[query];
    } else {
      let match = types[query] || attributes[query];
      // Check type mismatch
      if (match != null && typeof match.blotName === 'string') return null;
      return match;
    }
  } else if (query instanceof Node && type === Type.BLOT) {
    if (query instanceof HTMLElement) {
      let names = query.className.split(' ');
      for (let i in names) {
        if (names[i].indexOf(PREFIX) === 0) {
          return types[names[i].slice(PREFIX.length)];
        }
      }
      return tags[query.tagName];
    } else if (query instanceof Text) {
      return types['text'];
    }
  }
  return null;
}

export { create, define, match };
