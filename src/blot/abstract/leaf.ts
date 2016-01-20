import { Formattable, Leaf } from './blot';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';


abstract class LeafBlot extends ShadowBlot implements Leaf {
  static scope = Registry.Scope.INLINE_BLOT;

  abstract value(): any;
}


export default LeafBlot;
