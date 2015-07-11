describe('Attributor', function() {
  it('text', function() {
    var container = Registry.create('inline');
    var textBlot = new TextBlot('Test');
    container.appendChild(textBlot);
    textBlot.format('color', 'red');
    expect(textBlot.domNode.parentNode.style.color).toEqual('red');
  });
});
