import Attributor from './attributor/attributor';
import { Blot, BlotConstructor, Formattable, Root } from './blot/abstract/blot';
import ParchmentError from './error';
import Scope from './scope';

export interface RegistryInterface {
  create(sroll: Root, input: Node | string | Scope, value?: any): Blot;
  query(
    query: string | Node | Scope,
    scope: Scope,
  ): Attributor | BlotConstructor | null;
  register(...Definitions: any[]): any;
}

export default class Registry implements RegistryInterface {
  static blots = new WeakMap<Node, Blot>();

  static find(node: Node | null, bubble: boolean = false): Blot | null {
    if (node == null) return null;
    if (this.blots.has(node)) return this.blots.get(node) || null;
    if (bubble) return this.find(node.parentNode, bubble);
    return null;
  }

  attributes: { [key: string]: Attributor } = {};
  classes: { [key: string]: BlotConstructor } = {};
  tags: { [key: string]: BlotConstructor } = {};
  types: { [key: string]: Attributor | BlotConstructor } = {};

  create(scroll: Root, input: Node | string | Scope, value?: any): Blot {
    const match = this.query(input);
    if (match == null) {
      throw new ParchmentError(`Unable to create ${input} blot`);
    }
    const BlotClass = <BlotConstructor>match;
    const node =
      // @ts-ignore
      input instanceof Node || input['nodeType'] === Node.TEXT_NODE
        ? input
        : BlotClass.create(value);

    const blot = new BlotClass(scroll, <Node>node, value);
    Registry.blots.set(blot.domNode, blot);
    return blot;
  }

  find(node: Node | null, bubble: boolean = false): Blot | null {
    return Registry.find(node, bubble);
  }

  query(
    query: string | Node | Scope,
    scope: Scope = Scope.ANY,
  ): Attributor | BlotConstructor | null {
    let match;
    if (typeof query === 'string') {
      match = this.types[query] || this.attributes[query];
      // @ts-ignore
    } else if (query instanceof Text || query['nodeType'] === Node.TEXT_NODE) {
      match = this.types['text'];
    } else if (typeof query === 'number') {
      if (query & Scope.LEVEL & Scope.BLOCK) {
        match = this.types['block'];
      } else if (query & Scope.LEVEL & Scope.INLINE) {
        match = this.types['inline'];
      }
    } else if (query instanceof HTMLElement) {
      let names = (query.getAttribute('class') || '').split(/\s+/);
      for (let i in names) {
        match = this.classes[names[i]];
        if (match) break;
      }
      match = match || this.tags[query.tagName];
    }
    if (match == null) return null;
    // @ts-ignore
    if (scope & Scope.LEVEL & match.scope && scope & Scope.TYPE & match.scope)
      return match;
    return null;
  }

  register(...Definitions: any[]): any {
    if (Definitions.length > 1) {
      return Definitions.map(d => {
        return this.register(d);
      });
    }
    let Definition = Definitions[0];
    if (
      typeof Definition.blotName !== 'string' &&
      typeof Definition.attrName !== 'string'
    ) {
      throw new ParchmentError('Invalid definition');
    } else if (Definition.blotName === 'abstract') {
      throw new ParchmentError('Cannot register abstract class');
    }
    this.types[Definition.blotName || Definition.attrName] = Definition;
    if (typeof Definition.keyName === 'string') {
      this.attributes[Definition.keyName] = Definition;
    } else {
      if (Definition.className != null) {
        this.classes[Definition.className] = Definition;
      }
      if (Definition.tagName != null) {
        if (Array.isArray(Definition.tagName)) {
          Definition.tagName = Definition.tagName.map(function(
            tagName: string,
          ) {
            return tagName.toUpperCase();
          });
        } else {
          Definition.tagName = Definition.tagName.toUpperCase();
        }
        let tagNames = Array.isArray(Definition.tagName)
          ? Definition.tagName
          : [Definition.tagName];
        tagNames.forEach((tag: string) => {
          if (this.tags[tag] == null || Definition.className == null) {
            this.tags[tag] = Definition;
          }
        });
      }
    }
    return Definition;
  }
}
