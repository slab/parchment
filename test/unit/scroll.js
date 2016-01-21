"use strict"

describe('Scroll', function() {
  describe('path()', function() {
    beforeEach(function() {
      let containerNode = document.createElement('div');
      containerNode.innerHTML = '<p><strong>012</strong><span>34</span><em><strong>5678</strong></em></p>'
      this.container = Registry.create(containerNode);
    });

    it('middle', function() {
      let path = this.container.path(7);
      let expected = [
        [ 'scroll', 0 ],
        [ 'block', 5 ],
        [ 'italic', 0 ],
        [ 'bold', 0 ],
        [ 'text', 2 ]
      ];
      expect(path.length).toEqual(expected.length);
      path.forEach(function(position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });

    it('between blots', function() {
      let path = this.container.path(5);
      let expected = [
        [ 'scroll', 0 ],
        [ 'block', 5 ],
        [ 'italic', 0 ],
        [ 'bold', 0 ],
        [ 'text', 0 ]
      ];
      expect(path.length).toEqual(expected.length);
      path.forEach(function(position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });

    it('inclusive', function() {
      let path = this.container.path(3, true);
      let expected = [
        [ 'scroll', 0 ],
        [ 'block', 0 ],
        [ 'bold', 0 ],
        [ 'text', 3 ]
      ];
      expect(path.length).toEqual(expected.length);
      path.forEach(function(position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });

    it('last', function() {
      let path = this.container.path(9);
      let expected = [
        [ 'scroll', 9 ]
      ];
      expect(path.length).toEqual(expected.length);
      path.forEach(function(position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });
  });
});
