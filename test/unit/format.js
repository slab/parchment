describe('Format', function() {
  it('text format entire', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.formatAt(0, 4, 'bold', true);
    expect(textBlot.domNode.parentNode.tagName).toEqual('B');
    expect(textBlot.getValue()).toEqual('Test');
  });

  it('text format split', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.formatAt(1, 2, 'bold', true);
    expect(container.domNode.innerHTML).toEqual('T<b>es</b>t');
    expect(textBlot.next.statics.blotName).toEqual('bold');
    expect(textBlot.getValue()).toEqual('T');
    expect(textBlot.next.getValue()).toEqual(['es']);
  });
});
