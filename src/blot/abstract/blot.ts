import * as Registry from '../../registry';
import ParentBlot from './parent';
import ShadowNode from './shadow';


const DATA_KEY = '__blot_data';

export const DEFAULT_SCOPE = ['container', 'block', 'inline', 'leaf'];


export interface Position {
  blot: Blot;
  offset: number;
}


class Blot extends ShadowNode {
  static blotName = 'blot';

  static findBlot(node: Node, bubble: boolean = false): Blot {
    while (true) {
      if (node == null) return null;
      if (node[DATA_KEY] || !bubble) return node[DATA_KEY];
      node = node.parentNode;
    }
  }

  prev: Blot;
  next: Blot;
  parent: ParentBlot;

  constructor(node: any) {
    super(node);
    this.domNode[DATA_KEY] = this;
  }

  deleteAt(index: number, length: number): void {
    var target = this.isolate(index, length);
    target.remove();
  }

  findPath(index: number, inclusive: boolean): Position[] {
    return [{
      blot: this,
      offset: Math.min(index, this.getLength())
    }];
  }

  format(name: string, value: any): void {
    var mergeTarget = this;
    if (Registry.match(name, Registry.Type.BLOT) && value) {
      mergeTarget = <ParentBlot>this.wrap(name, value);
    } else if (Registry.match(name, Registry.Type.ATTRIBUTE) && value) {
      mergeTarget = <ParentBlot>this.wrap('inline', true);
      mergeTarget.format(name, value);
    };
    if (mergeTarget.prev != null) {
      mergeTarget.prev.merge();
    }
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    var target = <Blot>this.isolate(index, length);
    target.format(name, value);
  }

  insertAt(index: number, value: string, def?: any): void {
    var target = <Blot>this.split(index);
    var blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
    this.parent.insertBefore(blot, target);
  }

  merge(target: Blot = this.next): boolean {
    return false;
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

  remove(): void {
    delete this.domNode[DATA_KEY];
    super.remove();
    if (this.prev != null) {
      this.prev.merge();
    }
  }

  update(mutation: MutationRecord) { }
}


export default Blot;
