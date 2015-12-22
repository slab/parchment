describe('Blot', function() {
  it('findBlot()', function() {
    var blockNode = document.createElement('p');
    blockNode.innerHTML = '<span>01</span><em>23<strong>45</strong></em>';
    var blockBlot = new BlockBlot(blockNode);
    expect(Blot.findBlot(document.body)).not.toBeTruthy();
    expect(Blot.findBlot(blockNode)).toBe(blockBlot);
    expect(Blot.findBlot(blockNode.querySelector('span'))).toBe(blockBlot.children.head);
    expect(Blot.findBlot(blockNode.querySelector('em'))).toBe(blockBlot.children.tail);
    expect(Blot.findBlot(blockNode.querySelector('strong'))).toBe(blockBlot.children.tail.children.tail);
    var text01 = blockBlot.children.head.children.head;
    var text23 = blockBlot.children.tail.children.head;
    var text45 = blockBlot.children.tail.children.tail.children.head;
    expect(Blot.findBlot(text01.domNode)).toBe(text01);
    expect(Blot.findBlot(text23.domNode)).toBe(text23);
    expect(Blot.findBlot(text45.domNode)).toBe(text45);
  });

  it('offset()', function() {
    var blockNode = document.createElement('p');
    blockNode.innerHTML = '<span>01</span><em>23<strong>45</strong></em>';
    var blockBlot = new BlockBlot(blockNode);
    var boldBlot = blockBlot.children.tail.children.tail;
    expect(boldBlot.offset()).toEqual(2);
    expect(boldBlot.offset(blockBlot)).toEqual(4);
  });

  it('wrap()', function() {
    var parent = Registry.create('block');
    var head = Registry.create('bold');
    var text = Registry.create('text', 'Test');
    var tail = Registry.create('bold');
    parent.appendChild(head);
    parent.appendChild(text);
    parent.appendChild(tail);
    expect(parent.domNode.innerHTML).toEqual('<strong></strong>Test<strong></strong>');
    var wrapper = text.wrap('italic', true);
    expect(parent.domNode.innerHTML).toEqual('<strong></strong><em>Test</em><strong></strong>');
    expect(parent.children.head).toEqual(head);
    expect(parent.children.head.next).toEqual(wrapper);
    expect(parent.children.tail).toEqual(tail);
  });
});
