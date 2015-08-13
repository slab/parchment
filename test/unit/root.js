describe('Root', function() {
  describe('findPath()', function() {
    beforeEach(function() {
      var rootNode = document.createElement('div');
      rootNode.innerHTML = '<p><strong>012</strong><span>34</span><em><strong>5678</strong></em></p>'
      this.root = new RootBlot(rootNode);
    });

    it('boundary', function() {
      var path = this.root.findPath(5);
      var expected = [
        { blotName: 'block', offset: 5 },
        { blotName: 'italic', offset: 0 },
        { blotName: 'bold', offset: 0 },
        { blotName: 'text', offset: 0 }
      ];
      path.forEach(function(position, i) {
        expect(position.blot.statics.blotName).toEqual(expected[i].blotName);
        expect(position.offset).toEqual(expected[i].offset);
      });
    });

    it('inclusive', function() {
      var path = this.root.findPath(9);
      var expected = [
        { blotName: 'block', offset: 5 },
        { blotName: 'italic', offset: 0 },
        { blotName: 'bold', offset: 0 },
        { blotName: 'text', offset: 4 }
      ];
      path.forEach(function(position, i) {
        expect(position.blot.statics.blotName).toEqual(expected[i].blotName);
        expect(position.offset).toEqual(expected[i].offset);
      });
    });
  });
});
