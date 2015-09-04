import Blot from './blot';

class LeafBlot extends Blot {
  static blotName = 'leaf';

  getFormat(): Object {
    return {}
  }

  getValue(): Object | string {
    return {}
  }
}

export default LeafBlot;
