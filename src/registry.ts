import Attributor from './attributor/attributor';
import { Blot } from './blot/abstract/blot';


let attributes: { [key: string]: Attributor } = {};
let classes = {};
let tags: { [key: string]: String } = {};
let types = {};

export const DATA_KEY = '__blot';
export const PREFIX = 'blot-';

export enum Scope {
  TYPE = (1 << 2) - 1,          // 0011 Lower two bits
  LEVEL = ((1 << 4) - 1) << 2,  // 1100 Higher two bits

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


export function create(node: Node | string, value?: any): Blot {
  let BlotClass = query(node, Scope.BLOT);
  if (typeof BlotClass !== 'function') {
    throw new Error(`[Parchment] Unable to create ${node}`);
  }
  if (typeof node === 'string') {
    node = BlotClass.create(value);
  }
  return new BlotClass(node, value);
}

export function find(node: Node, bubble: boolean = false): Blot {
  if (node == null) return null;
  if (node[DATA_KEY] != null) return node[DATA_KEY].blot;
  if (bubble) return find(node.parentNode, bubble);
  return null;
}

export function query(query: string | Node, scope: Scope = Scope.ANY) {
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

export function register(Definition) {
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
