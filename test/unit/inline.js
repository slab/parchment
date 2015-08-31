describe('InlineBlot', function() {
  it('format ordering', function() {
    var container1 = Registry.create('block');
    container1.appendChild(Registry.create('text', 'Test'));
    var container2 = Registry.create('block');
    container2.appendChild(Registry.create('text', 'Test'));
    container1.formatAt(1, 2, 'bold', true);
    container1.formatAt(1, 2, 'italic', true);
    container2.formatAt(1, 2, 'italic', true);
    container2.formatAt(1, 2, 'bold', true);
    var expected = 'T<em><strong>es</strong></em>t';
    expect(container1.domNode.innerHTML).toEqual(expected);
    expect(container2.domNode.innerHTML).toEqual(expected);
  });

  it('format invalid', function() {
    var boldBlot = Registry.create('bold');
    boldBlot.appendChild(Registry.create('text', 'Test'));
    var original = boldBlot.domNode.outerHTML;
    expect(function() {
      boldBlot.format('nonexistent', true);
    }).not.toThrow();
    expect(boldBlot.domNode.outerHTML).toEqual(original);
  });

  it('format existing', function() {
    var italicBlot = Registry.create('italic');
    var boldBlot = Registry.create('bold');
    boldBlot.appendChild(Registry.create('text', 'Test'));
    italicBlot.appendChild(boldBlot);
    var original = italicBlot.domNode.outerHTML;
    expect(function() {
      italicBlot.formatAt(0, 4, 'bold', true);
      italicBlot.formatAt(0, 4, 'italic', true);
    }).not.toThrow();
    expect(italicBlot.domNode.outerHTML).toEqual(original);
  });

  it('format removal nonexistent', function() {
    var container = Registry.create('block');
    var italicBlot = Registry.create('italic');
    italicBlot.appendChild(Registry.create('text', 'Test'));
    container.appendChild(italicBlot);
    var original = italicBlot.domNode.outerHTML;
    expect(function() {
      italicBlot.formatAt(0, 4, 'bold', false);
    }).not.toThrow();
    expect(italicBlot.domNode.outerHTML).toEqual(original);
  });

  it('delete + unwrap', function() {
    var node = document.createElement('p');
    node.innerHTML = '<em><strong>Test</strong></em>!';
    var container = Registry.create(node);
    container.deleteAt(0, 4);
    expect(container.children.length).toEqual(1);
    expect(container.getValue()).toEqual(['!']);
  });

  it('getFormat()', function() {
    var italic = document.createElement('em');
    italic.style.color = 'red';
    italic.innerHTML = '<strong>Test</strong>!';
    var blot = Registry.create(italic);
    var formats = blot.getFormat();
    expect(formats).toEqual({ italic: true, color: 'red' });
  });

  it('change', function() {
    var container = Registry.create('block');
    var script = Registry.create('script', 'sup');
    container.appendChild(script);
    script.format('script', 'sub');
    expect(container.domNode.innerHTML).toEqual('<sub></sub>');
    expect(container.children.head.getFormat()).toEqual({ script: 'sub' });
  });
});
