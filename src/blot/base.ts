import { Scope } from '../registry';
import { ShadowNode } from './shadow';


class Blot extends ShadowNode {
  static nodeName = 'base';
  static scope = Scope.INLINE;

  prev: Blot = null;
  next: Blot = null;


  constructor(value: any) {
    super(value);
    this.build();
  }

  init(value: any): any {
    return value || document.createElement(this.statics.tagName);
  }

  build(): void {
    // TODO attributes
  }

  formats(): any {

  }

  values(): any {

  }

  format(name: string, value: any): void {

  }

  insertAt(index: number, value: string, def?: any): void {

  }

  formatAt(index: number, length: number, name: string, value: any): void {

  }

  deleteAt(index: number, length: number): void {

  }
}


export default Blot;
