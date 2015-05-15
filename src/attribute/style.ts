import Attribute = require('./attribute');
import ParchmentNode = require("../node/base/parchment")


class StyleAttribute implements Attribute {
  constructor(key) {
    this.styleKey = key;
  }

  add(node: ParchmentNode, value: string) {
    node.domNode.style[this.styleKey] = value;
  }

  remove(node: ParchmentNode) {
    node.domNode.style[this.styleKey] = '';
    if (!node.domNode.getAttribute('style')) {
      node.domNode.removeAttribute('style');
    }
  }

  value(node: ParchmentNode) {
    return node.style[this.styleKey];
  }
}


export = StyleAttribute;
