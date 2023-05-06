'use strict';

class ImageBlot extends EmbedBlot {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', value);
    }
    return node;
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  static formats(domNode) {
    if (domNode.hasAttribute('alt')) {
      return { alt: domNode.getAttribute('alt') };
    }
    return undefined;
  }

  format(name, value) {
    if (name === 'alt') {
      this.domNode.setAttribute(name, value);
    } else {
      super.format(name, value);
    }
  }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'IMG';

class VideoBlot extends EmbedBlot {
  static create(value) {
    let node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', value);
    }
    return node;
  }

  static formats(domNode) {
    let formats = {};
    if (domNode.hasAttribute('height'))
      formats['height'] = domNode.getAttribute('height');
    if (domNode.hasAttribute('width'))
      formats['width'] = domNode.getAttribute('width');
    return formats;
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (name === 'height' || name === 'width') {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
VideoBlot.blotName = 'video';
VideoBlot.scope = Scope.BLOCK_BLOT;
VideoBlot.tagName = 'VIDEO';

TestRegistry.register(ImageBlot);
TestRegistry.register(VideoBlot);
