import Blot from '../blot';


// TODO we can define insertText by calling insertText on neighbors

class EmbedBlot extends Blot {
  static nodeName = 'embed';

  values(): any {
    var value = {};
    value[this.statics.nodeName] = true;
    return value;
  }
}


export default EmbedBlot;
