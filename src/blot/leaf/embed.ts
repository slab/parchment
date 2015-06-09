import Blot from '../blot';


// TODO we can define insertText by calling insertText on neighbors

class EmbedBlot extends Blot {
  static blotName = 'embed';

  values(): any {
    var value = {};
    value[this.statics.blotName] = true;
    return value;
  }
}


export default EmbedBlot;
