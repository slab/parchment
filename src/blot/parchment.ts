import Blot from './abstract/blot';
import ContainerBlot from './container';
import LinkedList from '../collection/linked-list';
import ParentBlot from './abstract/parent';
import * as Registry from '../registry';


class ParchmentBlot extends ContainerBlot {
  static blotName = 'parchment';
  static tagName = 'DIV';

  children: LinkedList<ContainerBlot>;
  observer: MutationObserver;

  constructor(node: Node) {
    super(node);
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.update(mutations);
    });
    this.observer.observe(this.domNode, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
  }

  update(mutations: MutationRecord);
  update(mutations?: MutationRecord[]);
  update(mutations: any) {
    if (mutations instanceof MutationRecord) {
      return super.update(mutations);
    } else if (mutations == null) {
      mutations = this.observer.takeRecords();
    }
    mutations.forEach((mutation: MutationRecord) => {
      let blot = Blot.findBlot(mutation.target, true);
      if (blot != null) {
        blot.update(mutation);
      }
    });
    this.observer.takeRecords();  // Prevent changes from rebuilds
  }
}


export default ParchmentBlot;
