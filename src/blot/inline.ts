import FormatBlot from './abstract/format';
import * as Registry from '../registry';


class InlineBlot extends FormatBlot {
  static blotName = 'inline';
  static scope = Registry.Scope.INLINE_BLOT;
  static tagName = 'SPAN';
}


export default InlineBlot;
