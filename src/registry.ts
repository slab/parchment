import Attributor from './attributor/attributor';
import {
  type Blot,
  type BlotConstructor,
  type Root,
} from './blot/abstract/blot';
import ParchmentError from './error';
import Scope from './scope';

export type RegistryDefinition = Attributor | BlotConstructor;

export interface RegistryInterface {
  create(scroll: Root, input: Node | string | Scope, value?: any): Blot;
  query(query: string | Node | Scope, scope: Scope): RegistryDefinition | null;
  register(...definitions: any[]): any;
}

export default class Registry implements RegistryInterface {
  public static blots = new WeakMap<Node, Blot>();

  public static find(node?: Node | null, bubble = false): Blot | null {
    if (node == null) {
      return null;
    }
    if (this.blots.has(node)) {
      return this.blots.get(node) || null;
    }
    if (bubble) {
      let parentNode: Node | null = null;
      try {
        parentNode = node.parentNode;
      } catch (err) {
        // Probably hit a permission denied error.
        // A known case is in Firefox, event targets can be anonymous DIVs
        // inside an input element.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=208427
        return null;
      }
      return this.find(parentNode, bubble);
    }
    return null;
  }

  private attributes: { [key: string]: Attributor } = {};
  private classes: { [key: string]: BlotConstructor } = {};
  private tags: { [key: string]: BlotConstructor } = {};
  private types: { [key: string]: RegistryDefinition } = {};

  public create(scroll: Root, input: Node | string | Scope, value?: any): Blot {
    const match = this.query(input);
    if (match == null) {
      throw new ParchmentError(`Unable to create ${input} blot`);
    }
    const blotClass = match as BlotConstructor;
    const node =
      // @ts-expect-error Fix me later
      input instanceof Node || input.nodeType === Node.TEXT_NODE
        ? input
        : blotClass.create(value);

    const blot = new blotClass(scroll, node as Node, value);
    Registry.blots.set(blot.domNode, blot);
    return blot;
  }

  public find(node: Node | null, bubble = false): Blot | null {
    return Registry.find(node, bubble);
  }

  public query(
    query: string | Node | Scope,
    scope: Scope = Scope.ANY,
  ): RegistryDefinition | null {
    let match;
    if (typeof query === 'string') {
      match = this.types[query] || this.attributes[query];
      // @ts-expect-error Fix me later
    } else if (query instanceof Text || query.nodeType === Node.TEXT_NODE) {
      match = this.types.text;
    } else if (typeof query === 'number') {
      if (query & Scope.LEVEL & Scope.BLOCK) {
        match = this.types.block;
      } else if (query & Scope.LEVEL & Scope.INLINE) {
        match = this.types.inline;
      }
    } else if (query instanceof Element) {
      const names = (query.getAttribute('class') || '').split(/\s+/);
      names.some((name) => {
        match = this.classes[name];
        if (match) {
          return true;
        }
        return false;
      });
      match = match || this.tags[query.tagName];
    }
    if (match == null) {
      return null;
    }
    if (
      'scope' in match &&
      scope & Scope.LEVEL & match.scope &&
      scope & Scope.TYPE & match.scope
    ) {
      return match;
    }
    return null;
  }

  public register(...definitions: RegistryDefinition[]): RegistryDefinition[] {
    return definitions.map((definition) => {
      const isBlot = 'blotName' in definition;
      const isAttr = 'attrName' in definition;
      if (!isBlot && !isAttr) {
        throw new ParchmentError('Invalid definition');
      } else if (isBlot && definition.blotName === 'abstract') {
        throw new ParchmentError('Cannot register abstract class');
      }
      const key = isBlot
        ? definition.blotName
        : isAttr
        ? definition.attrName
        : (undefined as never); // already handled by above checks
      this.types[key] = definition;

      if (isAttr) {
        if (typeof definition.keyName === 'string') {
          this.attributes[definition.keyName] = definition;
        }
      } else if (isBlot) {
        if (definition.className) {
          this.classes[definition.className] = definition;
        }
        if (definition.tagName) {
          if (Array.isArray(definition.tagName)) {
            definition.tagName = definition.tagName.map((tagName: string) => {
              return tagName.toUpperCase();
            });
          } else {
            definition.tagName = definition.tagName.toUpperCase();
          }
          const tagNames = Array.isArray(definition.tagName)
            ? definition.tagName
            : [definition.tagName];
          tagNames.forEach((tag: string) => {
            if (this.tags[tag] == null || definition.className == null) {
              this.tags[tag] = definition;
            }
          });
        }
      }
      return definition;
    });
  }
}
