"use strict"

describe('TextBlot', function() {
  it('constructor(node)', function() {
    let node = document.createTextNode('Test');
    let blot = new TextBlot(node);
    expect(blot.text).toEqual('Test');
    expect(blot.domNode.data).toEqual('Test');
  });

  it('deleteAt() partial', function() {
    let blot = Registry.create('text', 'Test');
    blot.deleteAt(1, 2);
    expect(blot.getValue()).toEqual('Tt');
    expect(blot.getLength()).toEqual(2);
  });

  it('deleteAt() all', function() {
    let container = Registry.create('inline');
    let textBlot = Registry.create('text', 'Test');
    container.appendChild(textBlot);
    expect(container.domNode.firstChild).toEqual(textBlot.domNode);
    textBlot.deleteAt(0, 4);
    expect(textBlot.domNode.parentNode).toEqual(null);
    expect(container.domNode.firstChild).toEqual(null);
  });

  it('insertAt() text', function() {
    let textBlot = Registry.create('text', 'Test');
    textBlot.insertAt(1, 'ough');
    expect(textBlot.getValue()).toEqual('Toughest');
  });

  it('insertAt() other', function() {
    let container = Registry.create('inline');
    let textBlot = Registry.create('text', 'Test');
    container.appendChild(textBlot);
    textBlot.insertAt(2, 'image', {});
    expect(textBlot.getValue()).toEqual('Te');
    expect(textBlot.next.statics.blotName).toEqual('image');
    expect(textBlot.next.next.getValue()).toEqual('st');
  });

  it('split() middle', function() {
    let container = Registry.create('inline');
    let textBlot = Registry.create('text', 'Test');
    container.appendChild(textBlot);
    let after = textBlot.split(2);
    expect(textBlot.getValue()).toEqual('Te');
    expect(after.getValue()).toEqual('st');
    expect(textBlot.next).toEqual(after);
    expect(after.prev).toEqual(textBlot);
  });

  it('split() noop', function() {
    let container = Registry.create('inline');
    let textBlot = Registry.create('text', 'Test');
    container.appendChild(textBlot);
    let before = textBlot.split(0);
    let after = textBlot.split(4);
    expect(before).toEqual(textBlot);
    expect(after).toEqual(undefined);
  });

  it('split() force', function() {
    let container = Registry.create('inline');
    let textBlot = Registry.create('text', 'Test');
    container.appendChild(textBlot);
    let after = textBlot.split(4, true);
    expect(after).not.toEqual(textBlot);
    expect(after.getValue()).toEqual('');
    expect(textBlot.next).toEqual(after);
    expect(after.prev).toEqual(textBlot);
  });

  it('format wrap', function() {
    let container = Registry.create('inline');
    let textBlot = Registry.create('text', 'Test');
    container.appendChild(textBlot);
    textBlot.formatAt(0, 4, 'bold', true);
    expect(textBlot.domNode.parentNode.tagName).toEqual('STRONG');
    expect(textBlot.getValue()).toEqual('Test');
  });

  it('format split', function() {
    let container = Registry.create('block');
    let textBlot = Registry.create('text', 'Test');
    container.appendChild(textBlot);
    textBlot.formatAt(1, 2, 'bold', true);
    expect(container.domNode.innerHTML).toEqual('T<strong>es</strong>t');
    expect(container.getValue()).toEqual(['T', 'es', 't']);
    expect(textBlot.next.statics.blotName).toEqual('bold');
    expect(textBlot.getValue()).toEqual('T');
  });

  it('update()', function() {
    let container = Registry.create('container');
    let blockBlot = Registry.create('block');
    let textBlot = Registry.create('text', 'Test');
    container.appendChild(blockBlot);
    blockBlot.appendChild(textBlot);
    container.update()
    textBlot.domNode.data = 'Tested!';
    container.update();
    expect(textBlot.getValue()).toEqual('Tested!');
  });

  it('optimize() removal', function() {
    let container = Registry.create('container');
    let blockBlot = Registry.create('block');
    container.appendChild(blockBlot);
    blockBlot.insertAt(0, 'image', {});
    let textBlot = Registry.create('text', 'Test');
    blockBlot.appendChild(textBlot);
    container.update()
    textBlot.domNode.data = '';
    container.update();
    expect(blockBlot.children.length).toBe(1);
    expect(textBlot.domNode.parentNode).toBeFalsy();
  });
});
