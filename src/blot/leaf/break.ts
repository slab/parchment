import Blot from '../blot';


class BreakBlot extends Blot {
  static nodeName = 'break';
  static tagName = 'BR';

  length(): number {
    return 0;
  }

  formatAt(index: number, length: number, name: string, value: any): void {
    this.wrap(name, value);
  }

  insertEmbed(index: number, name: string, value: any): void {
    this.replace(name, value);
  }

  insertText(index: number, text: string): void {
    this.replace('text', text);
  }
}


export default BreakBlot;
