describe('merge', function() {
  it('format', function() {
    var node = document.createElement('p');
    node.innerHTML = '<strong>T</strong>es<strong>t</strong>';
    var container = Registry.create(node);
    container.formatAt(1, 2, 'bold', true);
    expect(node.innerHTML).toEqual('<strong>Test</strong>');
  });

  it('format recursive', function() {
    var node = document.createElement('p');
    node.innerHTML = '<em><strong>T</strong></em><strong>es</strong><em><strong>t</strong></em>';
    var container = Registry.create(node);
    container.formatAt(1, 2, 'italic', true);
    expect(node.innerHTML).toEqual('<em><strong>Test</strong></em>');
  });

  it('remove format', function() {
    var node = document.createElement('p');
    node.innerHTML = '<strong>T</strong><em><strong>es</strong></em><strong>t</strong>';
    var container = Registry.create(node);
    container.formatAt(1, 2, 'italic', false);
    expect(node.innerHTML).toEqual('<strong>Test</strong>');
  });

  it('format no merge from attributes', function() {
    var node = document.createElement('p');
    node.innerHTML = '<strong>Te</strong><em><strong style="color: red;">st</strong></em>';
    var container = Registry.create(node);
    container.formatAt(2, 2, 'italic', false);
    expect(container.children.length).toEqual(2);
    expect(container.children.head.statics.blotName).toEqual('bold');
    expect(container.children.tail.statics.blotName).toEqual('bold');
    expect(container.children.tail.getFormat()).toEqual({ bold: true, color: 'red' });
  });

  it('delete + merge', function() {
    var node = document.createElement('p');
    node.innerHTML = '<em>T</em>es<em>t</em>';
    var container = Registry.create(node);
    container.deleteAt(1, 2);
    expect(container.children.length).toEqual(1);
    expect(container.children.head.children.length).toEqual(1);
    expect(container.getValue()).toEqual(['Tt']);
  });
});
