import Blot, { Position, DATA_KEY } from './abstract/blot';
import BlockBlot from './block';
import LinkedList from '../collection/linked-list';
import ParentBlot from './abstract/parent';
import * as Registry from '../registry';


const OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true
};

const MAX_CLEAN_ITERATIONS = 1000;


class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static childName = 'block';
  static scope = Registry.Scope.CONTAINER & Registry.Scope.BLOT;
  static tagName = 'DIV';

  children: LinkedList<BlockBlot>;
  observer: MutationObserver;

  constructor(node: Node) {
    super(node);
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.update(mutations);
    });
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
  }

  deleteAt(index: number, length: number): void {
    this.update();
    super.deleteAt(index, length);
    this.optimize();
  }

  format(name: string, value: any): void { }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.update();
    super.formatAt(index, length, name, value);
    this.optimize();
  }

  getFormat(): Object {
    return {};
  }

  insertAt(index: number, value: string, def?: any): void {
    this.update();
    super.insertAt(index, value, def);
    this.optimize();
  }

  insertBefore(childBlot: BlockBlot, refBlot?: BlockBlot): void {
    super.insertBefore(childBlot, refBlot);
  }

  optimize(mutations: MutationRecord[] = []): void {
    super.optimize(mutations);
    // TODO use WeakMap
    mutations = mutations.concat(this.observer.takeRecords());
    let mark = (blot: Blot) => {
      if (blot == null || blot === this) return;
      if (blot.domNode[DATA_KEY].mutations == null) {
        blot.domNode[DATA_KEY].mutations = [];
      }
      mark(blot.parent);
    }
    let optimize = function(blot: Blot) {  // Post-order traversal
      if (blot instanceof ParentBlot) {
        blot.children.forEach(function(child) {
          if (blot.domNode[DATA_KEY].mutations == null) return;
          optimize(child);
        });
      }
      blot.optimize();
    }
    for (let i = 0; i < MAX_CLEAN_ITERATIONS && mutations.length > 0; i += 1) {
      mutations.forEach(function(mutation) {
        let blot = Blot.findBlot(mutation.target, true);
        if (blot != null && blot.domNode === mutation.target && mutation.type === 'childList') {
          mark(Blot.findBlot(mutation.previousSibling, false));
        }
        mark(blot);
      });
      this.children.forEach(optimize);
      mutations = this.observer.takeRecords();
    }
  }

  update(mutations?: MutationRecord[]): void {
    mutations = mutations || this.observer.takeRecords();
    // TODO use WeakMap
    mutations.map(function(mutation: MutationRecord) {
      let blot = Blot.findBlot(mutation.target, true);
      blot.domNode[DATA_KEY].mutations = blot.domNode[DATA_KEY].mutations || [];
      blot.domNode[DATA_KEY].mutations.push(mutation);
      return blot;
    }).forEach((blot: Blot) => {
      if (blot === this) {
        super.update(blot.domNode[DATA_KEY].mutations);
      } else {
        blot.update(blot.domNode[DATA_KEY].mutations);
      }
    });
    this.optimize(mutations);
  }
}


export default ContainerBlot;
