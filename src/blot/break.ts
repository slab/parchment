import { Leaf } from './abstract/blot';
import ShadowBlot from './abstract/shadow';
import * as Registry from '../registry';


class BreakBlot extends ShadowBlot implements Leaf {
  static blotName = 'break';
  static scope = Registry.Scope.INLINE_BLOT;
  static tagName = 'BR';

  length(): number {
    return 0;
  }

  value(): string {
    return '';
  }
}


export default ShadowBlot;
