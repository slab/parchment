import { Blot } from './blot';
import ParentBlot from './parent';
import BlockBlot from '../block';
import * as Registry from '../../registry';

class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static scope = Registry.Scope.BLOCK_BLOT;
  static tagName: string;

  prev!: BlockBlot | ContainerBlot | null;
  next!: BlockBlot | ContainerBlot | null;

  checkMerge(): boolean {
    return (
      this.next !== null && this.next.statics.blotName === this.statics.blotName
    );
  }

  checkUnwrap() {
    this.children.forEach((child: Blot) => {
      const allowed = this.statics.allowedChildren.some(
        (def: Registry.BlotConstructor) => child instanceof def,
      );
      if (!allowed) {
        this.isolate(child.offset(this), child.length());
        child.parent.unwrap();
      }
    });
  }

  deleteAt(index: number, length: number): void {
    super.deleteAt(index, length);
    this.checkUnwrap();
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    super.formatAt(index, length, name, value);
    this.checkUnwrap();
  }

  insertAt(index: number, value: string, def?: any): void {
    super.insertAt(index, value, def);
    this.checkUnwrap();
  }

  optimize(context: { [key: string]: any }): void {
    super.optimize(context);
    if (this.children.length === 0) {
      this.remove();
    } else if (this.next != null && this.checkMerge()) {
      this.next.moveChildren(this);
      this.next.remove();
    }
    this.checkUnwrap();
  }
}

export default ContainerBlot;
