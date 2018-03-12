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

  optimize(context: { [key: string]: any }): void {
    super.optimize(context);
    if (this.children.length === 0) {
      this.remove();
    } else if (this.next != null && this.checkMerge()) {
      this.next.moveChildren(this);
      this.next.remove();
    }
  }

  // replace() {}

  // wrap() {}
}

export default ContainerBlot;
