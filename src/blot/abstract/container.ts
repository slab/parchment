import ParentBlot from './parent';
import BlockBlot from '../block';
import * as Registry from '../../registry';

class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static scope = Registry.Scope.BLOCK_BLOT;
  static tagName: string;
  // static allowedChildren: Registry.BlotConstructor[] = [BlockBlot, ContainerBlot];
  static defaultChild = BlockBlot;

  prev!: BlockBlot | ContainerBlot | null;
  next!: BlockBlot | ContainerBlot | null;

  optimize(context: { [key: string]: any }): void {
    super.optimize(context);
    if (this.next != null && this.checkMerge()) {
      this.next.moveChildren(this);
      this.next.remove();
    }
  }

  checkMerge(): boolean {
    return (
      this.next !== null && this.next.statics.blotName === this.statics.blotName
    );
  }

  // replace() {}

  // wrap() {}
}

export default ContainerBlot;
