import FormatBlot from './abstract/format';
import * as Registry from '../registry';


class BlockBlot extends FormatBlot {
  static blotName = 'block';
  static child = 'break';
  static scope = Registry.Scope.BLOCK_BLOT;
  static tagName = 'P';
}


export default BlockBlot;
