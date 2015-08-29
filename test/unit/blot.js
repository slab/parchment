describe('Blot', function() {
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
