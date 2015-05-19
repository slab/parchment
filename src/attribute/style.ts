import Attribute = require('./base');
import Shadow = require("../node/base/shadow")


class StyleAttribute implements Attribute {
  protected styleName: string;

  constructor(name) {
    this.styleName = name;
  }

  add(node: Shadow.ShadowNode, value: string) {
    node.domNode.style[this.styleName] = value;
  }

  remove(node: Shadow.ShadowNode) {
    node.domNode.style[this.styleName] = '';
    if (!node.domNode.getAttribute('style')) {
      node.domNode.removeAttribute('style');
    }
  }

  value(node: Shadow.ShadowNode) {
    return node.style[this.styleName];
  }
}


export = StyleAttribute;
