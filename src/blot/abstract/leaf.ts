import Scope from '../../scope.js';
import type { Leaf } from './blot.js';
import ShadowBlot from './shadow.js';

class LeafBlot extends ShadowBlot implements Leaf {
  public static scope = Scope.INLINE_BLOT;

  /**
   * Returns the value represented by domNode if it is this Blot's type
   * No checking that domNode can represent this Blot type is required so
   * applications needing it should check externally before calling.
   */
  public static value(_domNode: Node): any {
    return true;
  }

  /**
   * Given location represented by node and offset from DOM Selection Range,
   * return index to that location.
   */
  public index(node: Node, offset: number): number {
    if (
      this.domNode === node ||
      this.domNode.compareDocumentPosition(node) &
        Node.DOCUMENT_POSITION_CONTAINED_BY
    ) {
      return Math.min(offset, 1);
    }
    return -1;
  }

  /**
   * Given index to location within blot, return node and offset representing
   * that location, consumable by DOM Selection Range
   */
  public position(index: number, _inclusive?: boolean): [Node, number] {
    const childNodes: Node[] = Array.from(this.parent.domNode.childNodes);
    let offset = childNodes.indexOf(this.domNode);
    if (index > 0) {
      offset += 1;
    }
    return [this.parent.domNode, offset];
  }

  /**
   * Return value represented by this blot
   * Should not change without interaction from API or
   * user change detectable by update()
   */
  public value(): any {
    return {
      [this.statics.blotName]: this.statics.value(this.domNode) || true,
    };
  }
}

export default LeafBlot;
