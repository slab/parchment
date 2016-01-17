"use strict"

describe('EmbedBlot', function() {
  it('getValue()', function() {
    let imageBlot = Registry.create('image');
    expect(imageBlot.getValue()).toEqual({ image: true });
  });

  it('deleteAt()', function() {
    let container = Registry.create('block');
    let imageBlot = Registry.create('image');
    container.appendChild(imageBlot);
    container.insertAt(1, '!');
    expect(container.getLength()).toBe(2);
    container.deleteAt(0, 1);
    expect(container.getLength()).toBe(1);
    expect(container.children.length).toBe(1);
    expect(imageBlot.domNode.parentNode).toBeFalsy();
  });

  it('format()', function() {
    let container = Registry.create('block');
    let imageBlot = Registry.create('image');
    container.appendChild(imageBlot);
    imageBlot.format('id', 'blot');
    expect(imageBlot.parent.getFormat()).toEqual({ id: 'blot' });
  });

  it('formatAt()', function() {
    let container = Registry.create('block');
    let imageBlot = Registry.create('image');
    container.appendChild(imageBlot);
    container.formatAt(0, 1, 'color', 'red');
    expect(container.children.head.statics.blotName).toBe('inline');
  });

  it('insertAt()', function() {
    let container = Registry.create('inline');
    let imageBlot = Registry.create('image');
    container.appendChild(imageBlot);
    imageBlot.insertAt(0, 'image', true);
    imageBlot.insertAt(0, '|');
    imageBlot.insertAt(1, '!');
    expect(container.getValue()).toEqual([{ image: true }, '|', { image: true }, '!']);
  });

  it('split()', function() {
    let blockNode = document.createElement('p');
    blockNode.innerHTML = '<em>Te</em><img><strong>st</strong>';
    let blockBlot = Registry.create(blockNode);
    let imageBlot = blockBlot.children.head.next;
    expect(imageBlot.split(0)).toBe(imageBlot);
    expect(imageBlot.split(1)).toBe(blockBlot.children.tail);
  });
});
