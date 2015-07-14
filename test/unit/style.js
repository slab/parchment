describe('Style Attributor', function() {
  it('add to text', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.format('color', 'red');
    expect(textBlot.domNode.parentNode.style.color).toEqual('red');
  });

  it('remove', function() {
    var container = Registry.create('inline');
    node = document.createElement('strong');
    node.innerHTML = 'Bold';
    node.style.color = 'red';
    var boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    boldBlot.formatAt(1, 2, 'color', false);
    expect(boldBlot.getValue()).toEqual(['B']);
    expect(boldBlot.next.getValue()).toEqual(['ol']);
    expect(boldBlot.next.domNode.style.color).toEqual('');
    expect(boldBlot.next.domNode.getAttribute('style')).toEqual(null);
  });

  it('remove nonexistent', function() {
    var container = Registry.create('inline');
    node = document.createElement('strong');
    node.innerHTML = 'Bold';
    var boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    boldBlot.formatAt(1, 2, 'color', false);
    expect(boldBlot.domNode.outerHTML).toEqual('<strong>Bold</strong>');
  });

  it('move attribute', function() {
    var container = Registry.create('inline');
    node = document.createElement('strong');
    node.innerHTML = 'Bold';
    node.style.color = 'red';
    var boldBlot = Registry.create(node);
    container.appendChild(boldBlot);
    container.formatAt(1, 2, 'bold', false);
    expect(boldBlot.getValue()).toEqual(['B']);
    expect(boldBlot.next.getValue()).toEqual(['ol']);
    expect(boldBlot.next.statics.blotName).toEqual('inline');
    expect(boldBlot.next.getFormat().color).toEqual('red');
  });
});
