import { Formattable } from './blot';
import LeafBlot from './leaf';


abstract class EmbedBlot extends LeafBlot implements Formattable {
  abstract format(name: string, value: any);
  abstract formats(): { [index: string]: any };

  index(node, offset): number {
    if (node !== this.domNode) return -1;
    return Math.min(offset, 1);
  }

  length(): number {
    return 1;
  }

  position(index: number, inclusive?: boolean): [Node, number] {
    let offset = [].indexOf.call(this.parent.domNode.childNodes, this.domNode);
    if (index > 0) offset += 1;
    return [this.parent.domNode, offset];
  }

  value(): boolean {
    return true;
  }
}


export default EmbedBlot;
