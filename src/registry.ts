import Attributor from './attributor/attributor';

var attributes = {};
var classes = {};
var tags = {};
var types = {};

export const PREFIX = 'blot-';

export enum Scope {
  ATTRIBUTE = 1,
  BLOT = 2,
  CONTAINER = 4,
  BLOCK = 8,
  INLINE = 16,
  LEAF = 32,

  TYPE = ATTRIBUTE | BLOT,
  LEVEL = CONTAINER | BLOCK | INLINE | LEAF,
  ANY = TYPE | LEVEL
};


function create(node: Node | string, value?: any) {
  var BlotClass = match(node, Scope.BLOT);
  if (typeof BlotClass !== 'function') {
    throw new Error(`[Parchment] Unable to create ${node}`);
  }
  if (typeof node === 'string') {
    node = BlotClass.create(value);
  }
  return new BlotClass(node);
}

function match(query: string | Node, scope: Scope = Scope.ANY) {
  let match;
  if (typeof query === 'string') {
    match = types[query] || attributes[query];
  } else if (query instanceof Text) {
    match = types['text'];
  } else if (query instanceof HTMLElement) {
    let names = query.className.split(/\s+/);
    for (let i in names) {
      if (names[i].indexOf(PREFIX) === 0) {
        match = types[names[i].slice(PREFIX.length)];
        break;
      }
    }
    match = match || tags[query.tagName];
  }
  if (match == null) return null;
  if (scope & Scope.LEVEL && !(match.scope & Scope.LEVEL & scope)) return null;
  if (scope & Scope.TYPE && !(match.scope & Scope.TYPE & scope)) return null;
  return match;
}

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
