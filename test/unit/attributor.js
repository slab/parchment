describe('Attributor', function() {
  it('TextBlot format()', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.format('color', 'red');
    expect(textBlot.domNode.parentNode.style.color).toEqual('red');
  });
});
