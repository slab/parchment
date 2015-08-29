describe('Container', function() {
  describe('findPath()', function() {
    beforeEach(function() {
      var containerNode = document.createElement('div');
      containerNode.innerHTML = '<p><strong>012</strong><span>34</span><em><strong>5678</strong></em></p>'
      this.container = new ContainerBlot(containerNode);
    });

    it('middle', function() {
      var path = this.container.findPath(7);
      var expected = [
        { blotName: 'block', offset: 5 },
        { blotName: 'italic', offset: 0 },
        { blotName: 'bold', offset: 0 },
        { blotName: 'text', offset: 2 }
      ];
      path.forEach(function(position, i) {
        expect(position.blot.statics.blotName).toEqual(expected[i].blotName);
        expect(position.offset).toEqual(expected[i].offset);
      });
    });

    it('between blots', function() {
      var path = this.container.findPath(5);
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
      var path = this.container.findPath(3, true);
      var expected = [
        { blotName: 'block', offset: 0 },
        { blotName: 'bold', offset: 0 },
        { blotName: 'text', offset: 3 }
      ];
      path.forEach(function(position, i) {
        expect(position.blot.statics.blotName).toEqual(expected[i].blotName);
        expect(position.offset).toEqual(expected[i].offset);
      });
    });

    it('last', function() {
      var path = this.container.findPath(9);
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
