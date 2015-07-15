fdescribe('InlineBlot', function() {
  beforeEach(function() {
    this.oldCompare = InlineBlot.compare;
    InlineBlot.compare = function(thisName, otherName) {
      var order = ['bold', 'italic', 'inline'];
      return order.indexOf(thisName) <= order.indexOf(otherName);
    }
  });

  afterEach(function() {
    InlineBlot.compare = this.oldCompare;
  });

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

  it('format + merge', function() {
    var node = document.createElement('p');
    node.innerHTML = '<strong>T</strong>es<strong>t</strong>';
    var container = Registry.create(node);
    container.formatAt(1, 2, 'bold', true);
    expect(node.innerHTML).toEqual('<strong>Test</strong>');
  });

  it('format removal + merge', function() {
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

  it('delete + unwrap', function() {
    var node = document.createElement('p');
    node.innerHTML = '<em><strong>Test</strong></em>!';
    var container = Registry.create(node);
    container.deleteAt(0, 4);
    expect(container.children.length).toEqual(1);
    expect(container.getValue()).toEqual(['!']);
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
