describe('TextBlot', function() {
  it('constructor(string)', function() {
    var blot = new TextBlot('Test');
    expect(blot.text).toEqual('Test');
    expect(blot.domNode.data).toEqual('Test');
  });

  it('constructor(node)', function() {
    var node = document.createTextNode('Test');
    var blot = new TextBlot(node);
    expect(blot.text).toEqual('Test');
    expect(blot.domNode.data).toEqual('Test');
  });

  it('deleteAt() partial', function() {
    var blot = new TextBlot('Test');
    blot.deleteAt(1, 2);
    expect(blot.getValue()).toEqual('Tt');
    expect(blot.getLength()).toEqual(2);
  });

  it('deleteAt() all', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    expect(container.domNode.firstChild).toEqual(textBlot.domNode);
    textBlot.deleteAt(0, 4);
    expect(textBlot.domNode.parentNode).toEqual(null);
    expect(container.domNode.firstChild).toEqual(null);
  });

  it('insertAt() text', function() {
    var textBlot = new TextBlot('Test');
    textBlot.insertAt(1, 'ough');
    expect(textBlot.getValue()).toEqual('Toughest');
  });

  it('insertAt() other', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.insertAt(2, 'image', {});
    expect(textBlot.getValue()).toEqual('Te');
    expect(textBlot.next.statics.blotName).toEqual('image');
    expect(textBlot.next.next.getValue()).toEqual('st');
  });

  it('split() middle', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    var after = textBlot.split(2);
    expect(textBlot.getValue()).toEqual('Te');
    expect(after.getValue()).toEqual('st');
    expect(textBlot.next).toEqual(after);
    expect(after.prev).toEqual(textBlot);
  });

  it('split() noop', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    var before = textBlot.split(0);
    var after = textBlot.split(4);
    expect(before).toEqual(textBlot);
    expect(after).toEqual(undefined);
  });

  it('split() force', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    var after = textBlot.split(4, true);
    expect(after).not.toEqual(textBlot);
    expect(after.getValue()).toEqual('');
    expect(textBlot.next).toEqual(after);
    expect(after.prev).toEqual(textBlot);
  });

  it('format wrap', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.formatAt(0, 4, 'bold', true);
    expect(textBlot.domNode.parentNode.tagName).toEqual('STRONG');
    expect(textBlot.getValue()).toEqual('Test');
  });

  it('format split', function() {
    var container = Registry.create('block');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.formatAt(1, 2, 'bold', true);
    expect(container.domNode.innerHTML).toEqual('T<strong>es</strong>t');
    expect(container.getValue()).toEqual(['T', 'es', 't']);
    expect(textBlot.next.statics.blotName).toEqual('bold');
    expect(textBlot.getValue()).toEqual('T');
  });
});
