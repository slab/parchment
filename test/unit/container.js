"use strict"

describe('Container', function() {
  describe('findPath()', function() {
    beforeEach(function() {
      let containerNode = document.createElement('div');
      containerNode.innerHTML = '<p><strong>012</strong><span>34</span><em><strong>5678</strong></em></p>'
      this.container = Registry.create(containerNode);
    });

    it('middle', function() {
      let path = this.container.findPath(7);
      let expected = [
        { blotName: 'container', offset: 0 },
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
      let path = this.container.findPath(5);
      let expected = [
        { blotName: 'container', offset: 0 },
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

    it('last', function() {
      let path = this.container.findPath(9);
      let expected = [
        { blotName: 'container', offset: 0 },
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
