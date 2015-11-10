import Attributor from './attributor/attributor';

var attributes = {};
var classes = {};
var tags = {};
var types = {};

export const PREFIX = 'blot-';

export const Type = {
  ATTRIBUTE: 'attribute',
  BLOT: 'blot'
};


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

// match(node)
// match(node, Type.ATTRIBUTE)
// match(node, BlockBlot, Type.ATTRIBUTE)
// match(node, Type.ATTRIBUTE, BlockBlot)
// match(node, BlockBlot)
function match(query: string | Node, type?: string, scope?: any);
function match(query: string | Node, scope?: any, type?: string);
function match(query: string | Node, type?: any, scope?:any) {
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
    if (scope != null) {
      if (match.blotName != null && !(match.prototype instanceof scope)) return null;
      if (match.attrName != null && (match.scope != scope)) return null;
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
