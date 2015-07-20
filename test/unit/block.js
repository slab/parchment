describe('BlockBlot', function() {
  it('getValue() + getFormat()', function() {
    var p = document.createElement('p');
    p.innerHTML = '<em style="color: red;"><strong>Test</strong>ing</em>!';
    var blot = Registry.create(p);
    var formats = blot.getFormat();
    var values = blot.getValue();
    expect(formats).toEqual([
      { italic: true, color: 'red', bold: true },
      { italic: true, color: 'red' },
      {}
    ]);
    expect(values).toEqual(['Test', 'ing', '!']);
  })
});
