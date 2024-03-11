import BlockBlot from '../../../src/blot/block.js';

export class HeaderBlot extends BlockBlot {
  static readonly blotName = 'header';
  static tagName = ['h1', 'h2'];
  static create(value?: number | string) {
    return super.create(value) as HTMLHeadingElement;
  }
}
