describe('Format', function() {
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

  it('text format entire', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.formatAt(0, 4, 'bold', true);
    expect(textBlot.domNode.parentNode.tagName).toEqual('STRONG');
    expect(textBlot.getValue()).toEqual('Test');
  });

  it('text format split', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.formatAt(1, 2, 'bold', true);
    expect(container.domNode.innerHTML).toEqual('T<strong>es</strong>t');
    expect(textBlot.next.statics.blotName).toEqual('bold');
    expect(textBlot.getValue()).toEqual('T');
    expect(textBlot.next.getValue()).toEqual(['es']);
  });

  it('format ordering', function() {
    var container1 = Registry.create('inline');
    var textBlot1 = new TextBlot('Test');
    container1.appendChild(textBlot1);
    var container2 = Registry.create('inline');
    var textBlot2 = new TextBlot('Test');
    container2.appendChild(textBlot2);
    container1.formatAt(1, 2, 'bold', true);
    container1.formatAt(1, 2, 'italic', true);
    container2.formatAt(1, 2, 'italic', true);
    container2.formatAt(1, 2, 'bold', true);
    var expected = 'T<em><strong>es</strong></em>t';
    expect(container1.domNode.innerHTML).toEqual(expected);
    expect(container2.domNode.innerHTML).toEqual(expected);
  });
});
