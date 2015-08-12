describe('Root', function() {
  describe('findPath()', function() {
    beforeEach(function() {
      var rootNode = document.createElement('div');
      rootNode.innerHTML = '<p><strong>Te</strong><em><strong>st</strong></em></p>'
      this.root = new RootBlot(rootNode);
    });

    it('boundary', function() {
      var path = this.root.findPath(2);
      var expected = [
        { blotName: 'block', offset: 2 },
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
      var path = this.root.findPath(4);
      var expected = [
        { blotName: 'block', offset: 2 },
        { blotName: 'italic', offset: 0 },
        { blotName: 'bold', offset: 0 },
        { blotName: 'text', offset: 2 }
      ];
      path.forEach(function(position, i) {
        expect(position.blot.statics.blotName).toEqual(expected[i].blotName);
        expect(position.offset).toEqual(expected[i].offset);
      });
    });
  });
});
