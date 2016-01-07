"use strict"

describe('Blot', function() {
  describe('findBlot()', function() {
    it('exact', function() {
      let blockNode = document.createElement('p');
      blockNode.innerHTML = '<span>01</span><em>23<strong>45</strong></em>';
      let blockBlot = new BlockBlot(blockNode);
      expect(Blot.findBlot(document.body)).toBeFalsy();
      expect(Blot.findBlot(blockNode)).toBe(blockBlot);
      expect(Blot.findBlot(blockNode.querySelector('span'))).toBe(blockBlot.children.head);
      expect(Blot.findBlot(blockNode.querySelector('em'))).toBe(blockBlot.children.tail);
      expect(Blot.findBlot(blockNode.querySelector('strong'))).toBe(blockBlot.children.tail.children.tail);
      let text01 = blockBlot.children.head.children.head;
      let text23 = blockBlot.children.tail.children.head;
      let text45 = blockBlot.children.tail.children.tail.children.head;
      expect(Blot.findBlot(text01.domNode)).toBe(text01);
      expect(Blot.findBlot(text23.domNode)).toBe(text23);
      expect(Blot.findBlot(text45.domNode)).toBe(text45);
    });

    it('bubble', function() {
      let blockBlot = Registry.create('block');
      let textNode = document.createTextNode('Test');
      blockBlot.domNode.appendChild(textNode);
      expect(Blot.findBlot(textNode)).toBeFalsy();
      expect(Blot.findBlot(textNode, true)).toEqual(blockBlot);
    });

    it('detached parent', function() {
      let blockNode = document.createElement('p');
      blockNode.appendChild(document.createTextNode('Test'));
      expect(Blot.findBlot(blockNode.firstChild)).toBeFalsy();
      expect(Blot.findBlot(blockNode.firstChild, true)).toBeFalsy();
    });
  });

  it('offset()', function() {
    let blockNode = document.createElement('p');
    blockNode.innerHTML = '<span>01</span><em>23<strong>45</strong></em>';
    let blockBlot = new BlockBlot(blockNode);
    let boldBlot = blockBlot.children.tail.children.tail;
    expect(boldBlot.offset()).toEqual(2);
    expect(boldBlot.offset(blockBlot)).toEqual(4);
  });

  it('wrap()', function() {
    let parent = Registry.create('block');
    let head = Registry.create('bold');
    let text = Registry.create('text', 'Test');
    let tail = Registry.create('bold');
    parent.appendChild(head);
    parent.appendChild(text);
    parent.appendChild(tail);
    expect(parent.domNode.innerHTML).toEqual('<strong></strong>Test<strong></strong>');
    let wrapper = text.wrap('italic', true);
    expect(parent.domNode.innerHTML).toEqual('<strong></strong><em>Test</em><strong></strong>');
    expect(parent.children.head).toEqual(head);
    expect(parent.children.head.next).toEqual(wrapper);
    expect(parent.children.tail).toEqual(tail);
  });
});
