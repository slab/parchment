import type LinkedList from '../../collection/linked-list.js';
import type LinkedNode from '../../collection/linked-node.js';
import type { RegistryDefinition } from '../../registry.js';
import Scope from '../../scope.js';

export interface BlotConstructor {
  new (...args: any[]): Blot;
  /**
   * Creates corresponding DOM node
   */
  create(value?: any): Node;

  blotName: string;
  tagName: string | string[];
  scope: Scope;
  className?: string;

  requiredContainer?: BlotConstructor;
  allowedChildren?: BlotConstructor[];
  defaultChild?: BlotConstructor;
}

/**
 * Blots are the basic building blocks of a Parchment document.
 *
 * Several basic implementations such as Block, Inline, and Embed are provided.
 * In general you will want to extend one of these, instead of building from scratch.
 * After implementation, blots need to be registered before usage.
 *
 * At the very minimum a Blot must be named with a static blotName and associated with either a tagName or className.
 * If a Blot is defined with both a tag and class, the class takes precedence, but the tag may be used as a fallback.
 * Blots must also have a scope, which determine if it is inline or block.
 */
export interface Blot extends LinkedNode {
  scroll: Root;
  parent: Parent;
  prev: Blot | null;
  next: Blot | null;
  domNode: Node;

  statics: BlotConstructor;

  attach(): void;
  clone(): Blot;
  detach(): void;
  isolate(index: number, length: number): Blot;

  /**
   * For leaves, length of blot's value()
   * For parents, sum of children's values
   */
  length(): number;

  /**
   * Returns offset between this blot and an ancestor's
   */
  offset(root?: Blot): number;
  remove(): void;
  replaceWith(name: string, value: any): Blot;
  replaceWith(replacement: Blot): Blot;
  split(index: number, force?: boolean): Blot | null;
  wrap(name: string, value?: any): Parent;
  wrap(wrapper: Parent): Parent;

  deleteAt(index: number, length: number): void;
  formatAt(index: number, length: number, name: string, value: any): void;
  insertAt(index: number, value: string, def?: any): void;

  /**
   * Called after update cycle completes. Cannot change the value or length
   * of the document, and any DOM operation must reduce complexity of the DOM
   * tree. A shared context object is passed through all blots.
   */
  optimize(context: { [key: string]: any }): void;
  optimize(mutations: MutationRecord[], context: { [key: string]: any }): void;

  /**
   * Called when blot changes, with the mutation records of its change.
   * Internal records of the blot values can be updated, and modifications of
   * the blot itself is permitted. Can be trigger from user change or API call.
   * A shared context object is passed through all blots.
   */
  update(mutations: MutationRecord[], context: { [key: string]: any }): void;
}

export interface Parent extends Blot {
  children: LinkedList<Blot>;
  domNode: HTMLElement;

  appendChild(child: Blot): void;
  descendant<T>(type: new () => T, index: number): [T, number];
  descendant<T>(matcher: (blot: Blot) => boolean, index: number): [T, number];
  descendants<T>(type: new () => T, index: number, length: number): T[];
  descendants<T>(
    matcher: (blot: Blot) => boolean,
    index: number,
    length: number,
  ): T[];
  insertBefore(child: Blot, refNode?: Blot | null): void;
  moveChildren(parent: Parent, refNode?: Blot | null): void;
  path(index: number, inclusive?: boolean): [Blot, number][];
  removeChild(child: Blot): void;
  unwrap(): void;
}

export interface Root extends Parent {
  create(input: Node | string | Scope, value?: any): Blot;
  find(node: Node | null, bubble?: boolean): Blot | null;
  query(query: string | Node | Scope, scope?: Scope): RegistryDefinition | null;
}

export interface Formattable extends Blot {
  /**
   * Apply format to blot. Should not pass onto child or other blot.
   */
  format(name: string, value: any): void;

  /**
   * Return formats represented by blot, including from Attributors.
   */
  formats(): { [index: string]: any };
}

export interface Leaf extends Blot {
  index(node: Node, offset: number): number;
  position(index: number, inclusive: boolean): [Node, number];
  value(): any;
}
