describe('Attributor', function() {
  it('build', function() {
    var blot = Registry.create('inline');
    blot.domNode.style.color = 'red';
    blot.domNode.style.fontSize = '24px';
    blot.domNode.id = 'blot-test'
    blot.domNode.classList.add('indent-2')
    blot.build();
    expect(Object.keys(blot.attributes).sort()).toEqual(['color', 'size', 'id', 'indent'].sort());
  });

  it('add to inline', function() {
    var container = Registry.create('block');
    var boldBlot = Registry.create('bold');
    container.appendChild(boldBlot);
    boldBlot.format('id', 'test-add');
    boldBlot.format('indent', '2');
    expect(boldBlot.domNode.id).toEqual('test-add');
    expect(boldBlot.domNode.classList.contains('indent-2')).toBe(true);
  });

  it('add to text', function() {
    var container = Registry.create('block');
    var textBlot = Registry.create('text', 'Test')
    container.appendChild(textBlot);
    textBlot.format('color', 'red');
    expect(textBlot.domNode.parentNode.style.color).toEqual('red');
  });

  it('add existing style', function() {
    var boldBlot = Registry.create('bold');
    boldBlot.format('color', 'red');
    expect(boldBlot.domNode.style.color).toEqual('red');
    var original = boldBlot.domNode.outerHTML;
    expect(function() {
      boldBlot.format('color', 'red');
    }).not.toThrow();
    expect(boldBlot.domNode.outerHTML).toEqual(original);
  });

  it('add existing class', function() {
    var boldBlot = Registry.create('bold');
    boldBlot.format('indent', 2);
    expect(boldBlot.domNode.classList.contains('indent-2')).toBe(true);
    boldBlot.format('indent', 3);
    expect(boldBlot.domNode.classList.contains('indent-2')).toBe(false);
    expect(boldBlot.domNode.classList.contains('indent-3')).toBe(true);
  });

  it('remove', function() {
    var container = Registry.create('block');
    node = document.createElement('strong');
    node.innerHTML = 'Bold';
    node.style.color = 'red';
    node.style.fontSize = '24px';
    node.classList.add('indent-5');
    node.id = 'test-remove';
    var boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    container.formatAt(1, 2, 'color', false);
    expect(container.getValue()).toEqual(['B', 'ol', 'd']);
    var targetNode = boldBlot.next.domNode;
    expect(targetNode.style.color).toEqual('');
    container.formatAt(1, 2, 'size', false);
    expect(targetNode.style.fontSize).toEqual('');
    expect(targetNode.getAttribute('style')).toEqual(null);
    container.formatAt(1, 2, 'id', false);
    expect(targetNode.id).toBeFalsy();
    container.formatAt(1, 2, 'indent', false);
    expect(targetNode.classList.contains('indent-5')).toBe(false);
  });

  it('remove nonexistent', function() {
    var container = Registry.create('block');
    node = document.createElement('strong');
    node.innerHTML = 'Bold';
    var boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    boldBlot.formatAt(1, 2, 'color', false);
    expect(boldBlot.domNode.outerHTML).toEqual('<strong>Bold</strong>');
  });

  it('move attribute', function() {
    var container = Registry.create('block');
    node = document.createElement('strong');
    node.innerHTML = 'Bold';
    node.style.color = 'red';
    var boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    container.formatAt(1, 2, 'bold', false);
    expect(container.getValue()).toEqual(['B', 'ol', 'd']);
    expect(boldBlot.next.statics.blotName).toEqual('inline');
    expect(boldBlot.next.getFormat().color).toEqual('red');
  });

  it('block', function() {
    var container = Registry.create('container');
    var block = Registry.create('header', 'h1');
    container.appendChild(block);
    block.format('align', 'right');
    expect(container.domNode.innerHTML).toBe('<h1 style="text-align: right;"></h1>');
    expect(container.children.head.getFormat()).toEqual({ header: 'h1', align: 'right' });
  });
});
