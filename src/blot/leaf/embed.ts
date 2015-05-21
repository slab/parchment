import Blot from '../base';
import { Scope } from '../../registry';


// TODO we can define insertText by calling insertText on neighbors

class EmbedBlot extends Blot {
  static nodeName = 'embed';
  static scope = Scope.LEAF;

  values(): any {
    var value = {};
    value[this.statics.nodeName] = true;
    return value;
  }
}


export default EmbedBlot;
