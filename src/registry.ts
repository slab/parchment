import Attributor from './attributor/attributor';
import ShadowBlot from './blot/abstract/shadow';


let attributes: { [key: string]: Attributor } = {};
let classes = {};
let tags: { [key: string]: String } = {};
let types = {};

export const PREFIX = 'blot-';

export enum Scope {
  TYPE = (1 << 2) - 1,          // 0011 Lower two bits
  LEVEL = ((1 << 2) - 1) << 2,  // 1100 Higher two bits

  ATTRIBUTE = (1 << 0) | LEVEL, // 1101
  BLOT = (1 << 1) | LEVEL,      // 1110
  BLOCK = (1 << 2) | TYPE,      // 1011
  INLINE = (1 << 3) | TYPE,     // 0111

  BLOCK_BLOT = BLOCK & BLOT,
  INLINE_BLOT = INLINE & BLOT,
  BLOCK_ATTRIBUTE = BLOCK & ATTRIBUTE,
  INLINE_ATTRIBUTE = INLINE & ATTRIBUTE,

  ANY = TYPE | LEVEL
};


function create(node: Node | string, value?: any): ShadowBlot {
  let BlotClass = match(node, Scope.BLOT);
  if (typeof BlotClass !== 'function') {
    throw new Error(`[Parchment] Unable to create ${node}`);
  }
  if (typeof node === 'string') {
    node = BlotClass.create(value);
  }
  return new BlotClass(node, value);
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
  if ((scope & Scope.LEVEL & match.scope) && (scope & Scope.TYPE & match.scope)) return match;
  return null;
}

function register(Definition) {
  if (typeof Definition.blotName !== 'string' && typeof Definition.attrName !== 'string') {
    throw new Error('[Parchment] Invalid definition');
  } else if (Definition.blotName === 'abstract') {
    throw new Error('[Parchment] Cannot register abstract class');
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
