import { Formattable, Leaf } from './blot';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';


abstract class EmbedBlot extends ShadowBlot implements Formattable, Leaf {
  static blotName = 'leaf';
  static scope = Registry.Scope.INLINE_BLOT;

  abstract format(name: string, value: any);
  abstract formats(): { [index: string]: any };

  length(): number {
    return 1;
  }

  value(): boolean {
    return true;
  }
}


export default EmbedBlot;
