import { describe, it, expect } from 'vitest';
import type { BlockBlot, InlineBlot } from '../../src/parchment.js';
import type { ImageBlot } from '../__helpers__/registry/embed.js';
import { setupContextBeforeEach } from '../setup.js';

describe('EmbedBlot', function () {
  const ctx = setupContextBeforeEach();

  it('value()', function () {
    const imageBlot = ctx.scroll.create('image', 'favicon.ico') as ImageBlot;
    expect(imageBlot.value()).toEqual({
      image: 'favicon.ico',
    });
  });

  it('deleteAt()', function () {
    const container = ctx.scroll.create('block') as BlockBlot;
    const imageBlot = ctx.scroll.create('image') as ImageBlot;
    container.appendChild(imageBlot);
    container.insertAt(1, '!');
    container.deleteAt(0, 1);
    expect(container.length()).toBe(1);
    expect(container.children.length).toBe(1);
    expect(imageBlot.domNode.parentNode).toBeFalsy();
  });

  it('format()', function () {
    const container = ctx.scroll.create('block') as BlockBlot;
    const imageBlot = ctx.scroll.create('image') as ImageBlot;
    container.appendChild(imageBlot);
    imageBlot.format('alt', 'Quill Icon');
    expect(imageBlot.formats()).toEqual({ alt: 'Quill Icon' });
  });

  it('formatAt()', function () {
    const container = ctx.scroll.create('block') as BlockBlot;
    const imageBlot = ctx.scroll.create('image');
    container.appendChild(imageBlot);
    container.formatAt(0, 1, 'color', 'red');
    expect(container.children.head?.statics.blotName).toBe('inline');
  });

  it('insertAt()', function () {
    const container = ctx.scroll.create('inline') as InlineBlot;
    const imageBlot = ctx.scroll.create('image');
    container.appendChild(imageBlot);
    imageBlot.insertAt(0, 'image', true);
    imageBlot.insertAt(0, '|');
    imageBlot.insertAt(1, '!');
    expect(container.domNode.innerHTML).toEqual('<img>|<img>!');
  });

  it('split()', function () {
    const blockNode = document.createElement('p');
    blockNode.innerHTML = '<em>Te</em><img><strong>st</strong>';
    const blockBlot = ctx.scroll.create(blockNode) as BlockBlot;
    const imageBlot = blockBlot.children.head?.next;
    expect(imageBlot?.split(0)).toBe(imageBlot);
    expect(imageBlot?.split(1)).toBe(blockBlot.children.tail);
  });

  it('index()', function () {
    const imageBlot = ctx.scroll.create('image') as ImageBlot;
    expect(imageBlot.index(imageBlot.domNode, 0)).toEqual(0);
    expect(imageBlot.index(imageBlot.domNode, 1)).toEqual(1);
    expect(imageBlot.index(document.body, 1)).toEqual(-1);
  });

  it('position()', function () {
    const container = ctx.scroll.create('block') as BlockBlot;
    const imageBlot = ctx.scroll.create('image') as ImageBlot;
    container.appendChild(imageBlot);
    const [node, offset] = imageBlot.position(1, true);
    expect(node).toEqual(container.domNode);
    expect(offset).toEqual(1);
  });
});
