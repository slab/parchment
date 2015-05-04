import ParchmentNode = require('../parchment-node');
import Registry = require('../registry');


class BlockNode extends ParchmentNode {
  static nodeName = 'block';
  static tagName = 'P';
  static scope = Registry.Scope.BLOCK;

  // TODO enable when we support trailign newline

  // deleteText(index, length) {
  //   if (index + length > this.length() && !!this.next) {
  //     this.mergeNext();
  //   }
  // }

  // format(name, value) {

  // }

  // formatText(index, length, name, value) {
  //   super.formatText(index, length, name, value);
  //   if (index + length > this.length()) {
  //     this.format(name, value);
  //   }
  // }

  // insertText(index, text) {
  //   var lines = text.split('\n');
  //   super.insertText(index, lines[0]);
  //   var next = this.next;
  //   lines.slice(1).forEach((lineText) => {
  //     var line = Registry.create('block');
  //     line.insertText(0, text);
  //     this.parent.insertBefore(line, next);
  //   });
  // }
}


export = BlockNode;
