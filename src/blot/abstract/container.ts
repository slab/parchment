import { Blot } from './blot';
import ParentBlot from './parent';
import BlockBlot from '../block';
import Scope from '../../scope';

class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static scope = Scope.BLOCK_BLOT;
  static tagName: string;

  prev!: BlockBlot | ContainerBlot | null;
  next!: BlockBlot | ContainerBlot | null;

  checkMerge(): boolean {
    return (
      this.next !== null && this.next.statics.blotName === this.statics.blotName
    );
  }

  deleteAt(index: number, length: number): void {
    super.deleteAt(index, length);
    this.enforceAllowedChildren();
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    super.formatAt(index, length, name, value);
    this.enforceAllowedChildren();
  }

  insertAt(index: number, value: string, def?: any): void {
    super.insertAt(index, value, def);
    this.enforceAllowedChildren();
  }

  optimize(context: { [key: string]: any }): void {
    super.optimize(context);
    if (this.children.length > 0 && this.next != null && this.checkMerge()) {
      this.next.moveChildren(this);
      this.next.remove();
    }
  }
}

export default ContainerBlot;
