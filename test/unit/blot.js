describe('Blot', function() {
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
