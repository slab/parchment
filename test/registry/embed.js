"use strict"

class ImageBlot extends EmbedBlot {
  format(name, value) {
    if (name === 'alt') {
      this.domNode.setAttribute(name, value);
    }
  }

  formats() {
    let format = {};
    if (this.domNode.hasAttribute('alt')) {
      format['alt'] = this.domNode.getAttribute('alt');
    }
    return format;
  }

  value() {
    return this.domNode.getAttribute('src') || true;
  }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'IMG';
ImageBlot.create = function(value) {
  let node = EmbedBlot.create.call(this, value);
  if (typeof value === 'string') {
    node.setAttribute('src', value);
  }
  return node;
}

Registry.register(ImageBlot);
