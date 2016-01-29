import { Formattable, Leaf } from './blot';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';


abstract class LeafBlot extends ShadowBlot implements Leaf {
  static scope = Registry.Scope.INLINE_BLOT;

  abstract index(node: Node, offset: number): number;
  abstract position(index: number, inclusive: boolean): [Node, number];
  abstract value(): any;
}


export default LeafBlot;
