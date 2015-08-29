import Blot from './blot';

class LeafBlot extends Blot {
  static blotName = 'leaf';

  getValue(): Object | string {
    return {}
  }
}

export default LeafBlot;
