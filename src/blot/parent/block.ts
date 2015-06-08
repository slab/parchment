import BreakBlot from '../leaf/break';
import Observable from '../observable';
import ParentBlot from './parent';
import { merge } from '../../util';
import * as Registry from '../../registry';


class BlockBlot extends ParentBlot implements Observable {
  static nodeName = 'block';
  static tagName = 'P';

  observer: MutationObserver;

  constructor(value: HTMLElement) {
    super(value);
    this.observer = new MutationObserver(this.observeHandler);
    this.observer.observe(this.domNode, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    });
  }

  observeHandler(mutations: MutationRecord[]): void {
    this.children.empty();
    this.build();
    this.observer.takeRecords();  // Ignore changes caused by this handler
  }

  update(): void {
    this.observeHandler(this.observer.takeRecords());
  }

  formats(): any {
    var collector = function(node): any[] {
      var format = node.formats() || {};
      if (node instanceof ParentBlot) {
        return node.children.reduce(function(memo, child) {
          return memo.concat(collector(child));
        }, []).map(merge.bind(null, format));
      } else {
        return [format];
      }
    };
    return this.children.reduce(function(memo, child) {
      return memo.concat(collector(child));
    }, []);
  }

  deleteAt(index: number, length: number): void {
    super.deleteAt(index, length);
    if (this.children.length === 0) {
      this.appendChild(Registry.create(BreakBlot.nodeName));
    }
  }

  format(name: string, value: any): void {
    if (typeof Registry.match(name) !== 'function') {
      this.attribute(name, value);
    } else if (value) {
      this.replace(name, value);
    } else {
      this.replace(BlockBlot.nodeName, true);
    }
  }
}


export default BlockBlot;
