import LinkedList from '../../collection/linked-list';
import LinkedNode from '../../collection/linked-node';


interface ParentBlot {
  children: LinkedList<ShadowBlot>;

  appendChild(child: ShadowBlot): void;
  build(): void;
  findPath(index: number): [ShadowBlot, number][];
  insertBefore(child: ShadowBlot, refNode?: ShadowBlot): void;
  moveChildren(parent: ParentBlot, refNode?: ShadowBlot): void;
  unwrap(): void;
}

abstract class ShadowBlot implements LinkedNode {
  prev: ShadowBlot;
  next: ShadowBlot;
  parent: ParentBlot;
  domNode: Node;

  static blotName = 'abstract';
  static isBlot<T>(blot, T): blot is T {
    return blot instanceof T;
  }

  abstract clone(): ShadowBlot;
  abstract findNode(index: number): [Node, number];
  abstract findOffset(node: Node): number;
  abstract getLength(): number;
  abstract insertInto(parentBlot: ParentBlot, refBlot?: ShadowBlot): void;
  abstract isolate(index: number, length: number): ShadowBlot;
  abstract offset(root?: ShadowBlot): number;
  abstract remove(): void;
  abstract replace(target: ShadowBlot): void;
  abstract replaceWith(name: string, value: any): ParentBlot;
  abstract split(index: number, force?: boolean): ShadowBlot;
  abstract wrap(name: string, value: any): ParentBlot;

  abstract deleteAt(index: number, length: number): void;
  abstract formatAt(index: number, length: number, name: string, value: any): void;
  abstract insertAt(index: number, value: string, def?: any): void;
  abstract optimize(mutations: MutationRecord[]): void;
  abstract update(mutations: MutationRecord[]): void;
}


export { ParentBlot, ShadowBlot as default };
