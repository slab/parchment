import LinkedList from '../../collection/linked-list';
import LinkedNode from '../../collection/linked-node';


interface Blot extends LinkedNode {
  parent: Parent;
  prev: Blot;
  next: Blot;
  domNode: Node;

  clone(): Blot;
  findNode(index: number): [Node, number];
  findOffset(node: Node): number;
  insertInto(parentBlot: Parent, refBlot?: Blot): void;
  isolate(index: number, length: number): Blot;
  offset(root?: Blot): number;
  remove(): void;
  replace(target: Blot): void;
  replaceWith(name: string, value: any): Parent;
  split(index: number, force?: boolean): Blot;
  wrap(name: string, value: any): Parent;

  deleteAt(index: number, length: number): void;
  formatAt(index: number, length: number, name: string, value: any): void;
  insertAt(index: number, value: string, def?: any): void;
  optimize(mutations?: MutationRecord[]): void;
  update(mutations?: MutationRecord[]): void;
}


interface Parent extends Blot {
  children: LinkedList<Blot>;
  domNode: HTMLElement;

  appendChild(child: Blot): void;
  build(): void;
  descendants<T>(type: { new (): T; }, index: number, length: number): T[];
  insertBefore(child: Blot, refNode?: Blot): void;
  moveChildren(parent: Parent, refNode?: Blot): void;
  path(index: number): [Blot, number][];
  unwrap(): void;
}


interface Formattable extends Blot {
  format(name: string, value: any): void;
  formats(): { [index: string]: any };
}


interface Leaf extends Blot {
  value(): any;
}


export { Blot, Parent, Formattable, Leaf };
