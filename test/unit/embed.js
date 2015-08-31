describe('EmbedBlot', function() {
  it('getValue()', function() {
    var imageBlot = Registry.create('image');
    expect(imageBlot.getValue()).toEqual({ image: true });
  });

  it('insertAt()', function() {
    var container = Registry.create('inline');
    var imageBlot = Registry.create('image');
    container.appendChild(imageBlot);
    imageBlot.insertAt(0, 'image', true);
    expect(container.children.head.getValue()).toEqual({ image: true });
    imageBlot.insertAt(1, '!');
    expect(container.children.tail.getValue()).toEqual('!');
  });

  it('split()', function() {
    var blockNode = document.createElement('p');
    blockNode.innerHTML = '<em>Te</em><img><strong>st</strong>';
    var blockBlot = Registry.create(blockNode);
    var imageBlot = blockBlot.children.head.next;
    expect(imageBlot.split(0)).toBe(imageBlot);
    expect(imageBlot.split(1)).toBe(blockBlot.children.tail);
  });
});
