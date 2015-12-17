import Attributor from './attributor/attributor';

var attributes = {};
var classes = {};
var tags = {};
var types = {};

export const PREFIX = 'blot-';

export enum Scope {
  CONTAINER = 1,
  BLOCK = 2,
  INLINE = 3,
  LEAF = 4
};

export const Type = {
  ATTRIBUTE: 'attribute',
  BLOT: 'blot'
};


function create(node: Node | string, value?: any) {
  var BlotClass = match(node, Type.BLOT);
  if (typeof BlotClass !== 'function') {
    throw new Error(`[Parchment] Unable to create ${node}`);
  }
  if (typeof node === 'string') {
    node = BlotClass.create(value);
  }
  return new BlotClass(node);
}

// match(node)
// match(node, Type.ATTRIBUTE)
// match(node, BlockBlot, Type.ATTRIBUTE)
// match(node, Type.ATTRIBUTE, BlockBlot)
// match(node, BlockBlot)
function match(query: string | Node, type?: string, scope?: Scope);
function match(query: string | Node, scope?: Scope, type?: string);
function match(query: string | Node, type?: any, scope?: any) {
  if (type != null && typeof type !== 'string') {
    [type, scope] = [scope, type];
  }
  if (typeof query === 'string') {
    let match = types[query] || attributes[query];
    if (match == null) return match;
    // Check type mismatch
    if (type != null) {
      if (type === Type.BLOT && match.blotName == null) return null;
      if (type === Type.ATTRIBUTE && match.attrName == null) return null;
    }
    if (scope != null && match.scope !== scope) {
      return null;
    }
    return match;
  } else if (query instanceof Node && type !== Type.ATTRIBUTE) {
    if (query instanceof HTMLElement) {
      let names = query.className.split(/\s+/);
      for (let i in names) {
        if (names[i].indexOf(PREFIX) === 0) {
          return types[names[i].slice(PREFIX.length)];
        }
      }
      return tags[query.tagName];
    } else if (query instanceof Text && type !== Type.ATTRIBUTE) {
      return types['text'];
    }
  }
  return null;
}

// Only support real classes since calling superclass definitions are so important
function register(Definition) {
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

export { create, match, register };
