import Blot, { Position } from '../blot';
import Observable from '../observable';
import ParentBlot from './parent';
import * as Registry from '../../registry';


class ContainerBlot extends ParentBlot implements Observable {
  static nodeName = 'container';
  static tagName = 'DIV';

  observer: MutationObserver;

  constructor(value: HTMLElement) {
    super(value);
    this.observer = new MutationObserver(this.observeHandler);
    this.observer.observe(this.domNode, { childList: true });
  }

  observeHandler(mutations: MutationRecord[]): void {
    mutations.forEach(function(mutation) {
      Array.prototype.slice.call(mutation.removedNodes).forEach(function(node) {
        var blot = Blot.findBlot(node);
        if (blot != null) {
          blot.remove();
          this.onUpdate('remove', blot);
        }
      });
      Array.prototype.slice.call(mutation.addedNodes).forEach(node => {
        var refBlot = Blot.findBlot(mutation.nextSibling);
        var blot = Registry.create(node);
        if (blot != null) {
          this.insertBefore(blot, refBlot);
          this.onUpdate('add', blot);
        } else if (node.parentNode != null) {
          node.parentNode.removeChild(node);
        }
      });
    });
    this.observer.takeRecords();  // Ignore changes caused by this handler
  }

  onUpdate(type: string, blot: Blot): void {
    // Meant for subclasses to overwrite
  }

  update(): void {
    this.observeHandler(this.observer.takeRecords());
  }

  findPath(index: number): Position[] {
    return super.findPath(index).slice(1);    // Exclude ourself from result
  }

  getFormat(): any[] {
    return this.children.map(function(child) {
      return child.getFormat();
    });
  }

  getValue(): any[] {
    return this.children.map(function(child) {
      return child.getValue();
    });
  }
}


export default ContainerBlot;
