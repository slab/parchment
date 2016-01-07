import * as Registry from '../../registry';
import ParentBlot from './parent';
import ShadowNode from './shadow';


export const DATA_KEY = '__blot';


export interface Position {
  blot: Blot;
  offset: number;
}


abstract class Blot extends ShadowNode {
  static blotName: string;
  static className: string;
  static tagName: string;

  static create(value: any): Node {
    if (this.tagName == null) {
      throw new Error('[Parchment] Blot definition missing tagName');
    }
    let node;
    if (Array.isArray(this.tagName)) {
      if (typeof value === 'number') {
        node = document.createElement(this.tagName[value - 1]);
      } else if (this.tagName.indexOf(value) > -1) {
        node = document.createElement(value);
      } else {
        node = document.createElement(this.tagName[0]);
      }
    } else {
      node = document.createElement(this.tagName);
    }
    if (this.className) {
      node.classList.add(Registry.PREFIX + this.className);
    }
    return node;
  }

  static findBlot(node: Node, bubble: boolean = false): Blot {
    if (node == null) return null;
    if (node[DATA_KEY] != null) return node[DATA_KEY].blot;
    if (bubble) return this.findBlot(node.parentNode, bubble);
    return null;
  }

  prev: Blot;
  next: Blot;
  parent: ParentBlot;

  constructor(node: Node) {
    super(node);
    this.domNode[DATA_KEY] = { blot: this };
  }

  insertInto(parentBlot: ParentBlot, refBlot?: Blot): void {
    if (this.parent != null) {
      this.parent.children.remove(this);
    }
    parentBlot.children.insertBefore(this, refBlot);
    if (refBlot != null) {
      var refDomNode = refBlot.domNode;
    }
    if (this.next == null || this.domNode.nextSibling != refDomNode) {
      parentBlot.domNode.insertBefore(this.domNode, refDomNode);
    }
    this.parent = parentBlot;
  }

  isolate(index: number, length: number): Blot {
    return <Blot>super.isolate(index, length);
  }

  offset(root?: Blot): number {
    if (this.parent == null || root == this) return 0;
    // TODO rewrite this when we properly define parent as a BlotParent
    if (root == null) {
      return this.parent.children.offset(this);
    } else {
      return this.parent.children.offset(this) + this.parent.offset(root);
    }
  }

  optimize(mutations: MutationRecord[] = []): void {
    delete this.domNode[DATA_KEY].mutations;
  }

  split(index: number, force?: boolean): Blot {
    return <Blot>super.split(index, force);
  }


  abstract deleteAt(index: number, length: number): void;
  abstract format(name: string, value: any): void;
  abstract formatAt(index: number, length: number, name: string, value: any): void;
  abstract insertAt(index: number, value: string, def ?: any): void;

  abstract getFormat(): Object;
  abstract getValue(): Object | string;
  abstract findNode(index: number): [Node, number];
  abstract findOffset(node: Node): number;
  abstract findPath(index: number, inclusive: boolean): Position[];
  abstract update(mutations: MutationRecord[]): void;
}


export default Blot;
