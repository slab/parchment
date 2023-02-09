import Scope from '../../scope';
import BlockBlot from '../block';
import ParentBlot from './parent';

class ContainerBlot extends ParentBlot {
  public static blotName = 'container';
  public static scope = Scope.BLOCK_BLOT;
  public static tagName: string | string[];

  public prev!: BlockBlot | ContainerBlot | null;
  public next!: BlockBlot | ContainerBlot | null;

  public checkMerge(): boolean {
    return (
      this.next !== null && this.next.statics.blotName === this.statics.blotName
    );
  }

  public deleteAt(index: number, length: number): void {
    super.deleteAt(index, length);
    this.enforceAllowedChildren();
  }

  public formatAt(
    index: number,
    length: number,
    name: string,
    value: any,
  ): void {
    super.formatAt(index, length, name, value);
    this.enforceAllowedChildren();
  }

  public insertAt(index: number, value: string, def?: any): void {
    super.insertAt(index, value, def);
    this.enforceAllowedChildren();
  }

  public optimize(context: { [key: string]: any }): void {
    super.optimize(context);
    if (this.children.length > 0 && this.next != null && this.checkMerge()) {
      this.next.moveChildren(this);
      this.next.remove();
    }
  }
}

export default ContainerBlot;
