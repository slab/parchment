describe('Block', function() {
  describe('format', function() {
    it('add', function() {
      var container = Registry.create('container');
      var block = Registry.create('block');
      container.appendChild(block);
      block.format('header', 'h1');
      expect(container.domNode.innerHTML).toBe('<h1></h1>');
      expect(container.children.head.statics.blotName).toBe('header');
      expect(container.children.head.getFormat()).toEqual({ header: 'h1' });
    });

    it('remove', function() {
      var container = Registry.create('container');
      var block = Registry.create('header', 'h1');
      container.appendChild(block);
      block.format('header', false);
      expect(container.domNode.innerHTML).toBe('<p></p>');
      expect(container.children.head.statics.blotName).toBe('block');
    });

    it('change', function() {
      var container = Registry.create('container');
      var block = Registry.create('header', 'h1');
      container.appendChild(block);
      block.format('header', 'h2');
      expect(container.domNode.innerHTML).toBe('<h2></h2>');
      expect(container.children.head.statics.blotName).toBe('header');
      expect(container.children.head.getFormat()).toEqual({ header: 'h2' });
    });
  })
});
