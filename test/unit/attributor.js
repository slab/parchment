describe('Attributor', function() {
  it('build', function() {
    var blot = Registry.create('inline');
    blot.domNode.style.color = 'red';
    blot.domNode.style.fontSize = '24px';
    blot.domNode.id = 'blot-test'
    blot.build();
    expect(Object.keys(blot.attributes).sort()).toEqual(['color', 'size', 'id'].sort());
  });

  it('add to inline', function() {
    var container = Registry.create('block');
    var boldBlot = Registry.create('bold');
    container.appendChild(boldBlot);
    boldBlot.format('id', 'test-add');
    expect(boldBlot.domNode.id).toEqual('test-add');
  });

  it('add to text', function() {
    var container = Registry.create('block');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.format('color', 'red');
    expect(textBlot.domNode.parentNode.style.color).toEqual('red');
  });

  it('add existing', function() {
    var boldBlot = Registry.create('bold');
    boldBlot.format('color', 'red');
    expect(boldBlot.domNode.style.color).toEqual('red');
    var original = boldBlot.domNode.outerHTML;
    expect(function() {
      boldBlot.format('color', 'red');
    }).not.toThrow();
    expect(boldBlot.domNode.outerHTML).toEqual(original);
  });

  it('remove', function() {
    var container = Registry.create('block');
    node = document.createElement('strong');
    node.innerHTML = 'Bold';
    node.style.color = 'red';
    node.style.fontSize = '24px';
    node.id = 'test-remove';
    var boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    container.formatAt(1, 2, 'color', false);
    expect(container.getValue()).toEqual(['B', 'ol', 'd']);
    expect(boldBlot.next.domNode.style.color).toEqual('');
    container.formatAt(1, 2, 'size', false);
    expect(boldBlot.next.domNode.style.fontSize).toEqual('');
    expect(boldBlot.next.domNode.getAttribute('style')).toEqual(null);
    container.formatAt(1, 2, 'id', false);
    expect(boldBlot.next.domNode.id).toBeFalsy();
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

  it('remove with unwrap', function() {
    var container = Registry.create('block');
    italic = document.createElement('em');
    italic.innerHTML = '!';
    var italicBlot = Registry.create(italic);
    inline = document.createElement('span');
    inline.innerHTML = 'Test';
    inline.style.color = 'red';
    var inlineBlot = Registry.create(inline);
    container.appendChild(inlineBlot);
    container.appendChild(italicBlot);
    container.formatAt(0, 4, 'color', false);
    expect(container.children.head instanceof TextBlot).toEqual(true);
    expect(container.domNode.innerHTML).toEqual('Test<em>!</em>');
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
