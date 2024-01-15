import type LinkedList from '../../collection/linked-list';
import type LinkedNode from '../../collection/linked-node';
import type { RegistryDefinition } from '../../registry';
import Scope from '../../scope';

export interface BlotConstructor {
  blotName: string;
  className?: string;
  tagName: string | string[];
  new (...args: any[]): Blot;
  create(value?: any): Node;
}

export interface Blot extends LinkedNode {
  scroll: Root;
  parent: Parent;
  prev: Blot | null;
  next: Blot | null;
  domNode: Node;

  statics: {
    allowedChildren?: BlotConstructor[];
    blotName: string;
    className?: string;
    defaultChild?: BlotConstructor;
    requiredContainer?: BlotConstructor;
    scope: Scope;
    tagName: string | string[];
  };

  attach(): void;
  clone(): Blot;
  detach(): void;
  isolate(index: number, length: number): Blot;
  length(): number;
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
  optimize(context: { [key: string]: any }): void;
  optimize(mutations: MutationRecord[], context: { [key: string]: any }): void;
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
  insertBefore(child: Blot, refNode?: Blot): void;
  moveChildren(parent: Parent, refNode?: Blot): void;
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
  format(name: string, value: any): void;
  formats(): { [index: string]: any };
}

export interface Leaf extends Blot {
  index(node: Node, offset: number): number;
  position(index: number, inclusive: boolean): [Node, number];
  value(): any;
}
