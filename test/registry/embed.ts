import EmbedBlot from '../../src/blot/embed';
import Scope from '../../src/scope';

export class ImageBlot extends EmbedBlot {
  declare domNode: HTMLImageElement;
  static readonly blotName = 'image';
  static tagName = 'IMG';
  static create(value: string) {
    let node = super.create(value) as HTMLElement;
    if (typeof value === 'string') {
      node.setAttribute('src', value);
    }
    return node;
  }

  static value(domNode: HTMLImageElement) {
    return domNode.getAttribute('src');
  }

  static formats(domNode: HTMLImageElement) {
    if (domNode.hasAttribute('alt')) {
      return { alt: domNode.getAttribute('alt') };
    }
    return undefined;
  }

  format(name: string, value: string) {
    if (name === 'alt') {
      this.domNode.setAttribute(name, value);
    } else {
      super.format(name, value);
    }
  }
}

export class VideoBlot extends EmbedBlot {
  declare domNode: HTMLVideoElement;
  static scope = Scope.BLOCK_BLOT;
  static readonly blotName = 'video';
  static tagName = 'VIDEO';
  static create(value: string) {
    let node = super.create(value) as HTMLVideoElement;
    if (typeof value === 'string') {
      node.setAttribute('src', value);
    }
    return node;
  }

  static formats(domNode: HTMLVideoElement) {
    let formats: Partial<{ height: string; width: string }> = {};
    const height = domNode.getAttribute('height');
    const width = domNode.getAttribute('width');
    height && (formats.height = height);
    width && (formats.width = width);
    return formats;
  }

  static value(domNode: HTMLVideoElement) {
    return domNode.getAttribute('src');
  }

  format(name: string, value: unknown) {
    if (name === 'height' || name === 'width') {
      if (typeof value === 'string') {
        this.domNode.setAttribute(name, value);
      } else if (value === false || value === null) {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
