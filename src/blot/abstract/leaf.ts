import Blot from './blot';
import FormatBlot from './format';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';


abstract class LeafBlot extends Blot {
  static scope = Registry.Scope.INLINE_BLOT;

  abstract value(): any;

  deleteAt(index: number, length: number): void {
    let blot = this.isolate(index, length);
    blot.remove();
  }

  findNode(index: number): [Node, number] {
    return [this.domNode, 0];
  }

  findOffset(node: Node): number {
    return node === this.domNode ? 0 : -1;
  }

  findPath(index: number): [ShadowBlot, number][] {
    return [[this, Math.min(index, this.length())]];
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    if (!value) return;
    let blot = this.isolate(index, length);
    if (Registry.match(name, Registry.Scope.BLOT)) {
      blot.wrap(name, value);
    } else if (Registry.match(name, Registry.Scope.ATTRIBUTE)) {
      let parent = <FormatBlot>blot.wrap('inline', true);
      parent.format(name, value);
    }
  }

  insertAt(index: number, value: string, def?: any): void {
    let blot = (def == null) ? Registry.create('text', value) : Registry.create(value, def);
    let ref = this.split(index);
    this.parent.insertBefore(blot, ref);
  }
}


export default LeafBlot;
