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

class ContainerBlot extends ParentBlot {
  static blotName = 'container';
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
    this.update(this.observer.takeRecords());
    super.deleteAt(index, length);
    this.optimize();
  }

  format(name: string, value: any): void {
    this.update(this.observer.takeRecords());
    this.format(name, value);
    this.optimize();
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.update(this.observer.takeRecords());
    super.formatAt(index, length, name, value);
    this.optimize();
  }

  getBlocks(): BlockBlot[] {
    return this.getDescendants<BlockBlot>(BlockBlot);
  }

  getFormat(): any[] {
    return this.getBlocks().map(function(block) {
      return block.getFormat();
    });
  }

  getValue(): any[] {
    return this.getBlocks().map(function(block) {
      return block.getValue();
    });
  }

  insertAt(index: number, value: string, def?: any): void {
    this.update(this.observer.takeRecords());
    super.insertAt(index, value, def);
    this.optimize();
  }

  insertBefore(childBlot: BlockBlot, refBlot?: BlockBlot): void {
    super.insertBefore(childBlot, refBlot);
  }

  optimize(): void {
    // TODO use WeakMap
    let mutations = this.observer.takeRecords();
    this.observer.disconnect();
    mutations.forEach((mutation: MutationRecord) => {
      let blot = Blot.findBlot(mutation.target, true);
      while (blot != null && blot != this) {
        if (blot.domNode === mutation.target) {
          blot.domNode[DATA_KEY].mutations = blot.domNode[DATA_KEY].mutations || [];
          blot.domNode[DATA_KEY].mutations.push(mutation);
        } else if (blot.domNode[DATA_KEY].mutations == null) {
          blot.domNode[DATA_KEY].mutations = [];
        } else {
          break;
        }
      }
    });
    let traverse = function(blot: Blot): void {  // Post-order
      if (blot instanceof ParentBlot) {
        blot.children.forEach(function(child) {
          if (blot.domNode[DATA_KEY].mutations != null) {
            traverse(child);
          }
        });
      }
      blot.optimize();
    }
    this.children.forEach(traverse);
    this.observer.observe(this.domNode, OBSERVER_CONFIG);
  }

  update(mutations: MutationRecord[]): void {
    // TODO use WeakMap
    mutations.map((mutation: MutationRecord) => {
      let blot = Blot.findBlot(mutation.target, true);
      if (blot == null || blot === this) return null;
      blot.domNode[DATA_KEY].mutations = blot.domNode[DATA_KEY].mutations || [];
      blot.domNode[DATA_KEY].mutations.push(mutation);
    }).forEach((blot: Blot) => {
      if (blot == null || blot.domNode[DATA_KEY].mutations == null) return;
      blot.update(blot[DATA_KEY].mutations);
      Blot.prototype.optimize.call(blot);
    });
    this.optimize();
  }
}


export default ContainerBlot;
