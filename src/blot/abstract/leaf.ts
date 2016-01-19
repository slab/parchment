import { Formattable, Terminal } from './blot';
import ShadowBlot from './shadow';
import * as Registry from '../../registry';


abstract class LeafBlot extends ShadowBlot implements Formattable, Terminal {
  static blotName = 'leaf';
  static scope = Registry.Scope.LEAF & Registry.Scope.BLOT;

  abstract format(name: string, value: any);
  abstract formats(): { [index: string]: any };

  length(): number {
    return 1;
  }

  value(): boolean {
    return true;
  }

  update(mutations: MutationRecord[] = []): void {
    // Nothing to do
  }
}


export default LeafBlot;
