import Attributor from './attributor/attributor';


var tags = {};
var types = {};

export enum Type {
  ATTRIBUTE = 1,
  BLOT = 2
}


function create(name: Node);
function create(name: string, value?: any);
function create(name: any, value?: any): any {
  var BlotClass = match(name);
  if (typeof BlotClass !== 'function') {
    console.error(`Unable to create ${name}`);
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
  if (typeof Definition.blotName === 'string') {
    // TODO warn of tag/type overwrite
    types[Definition.blotName] = Definition;
    if (typeof Definition.tagName === 'string') {
      tags[Definition.tagName.toUpperCase()] = Definition;
    }
    return Definition;
  } else if (typeof Definition.attrName === 'string') {
    return types[Definition.attrName] = Definition;
  } else {
    console.error('Invalid definition');
  }
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
    return match;
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
