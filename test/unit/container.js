"use strict"

describe('Container', function() {
  describe('descendants()', function() {
    beforeEach(function() {
      let node = document.createElement('p');
      node.innerHTML = '<span>0</span><em>1<strong>2</strong><img></em>4';
      this.blot = Registry.create(node);
    });

    it('all', function() {
      expect(this.blot.descendants(ShadowBlot).length).toEqual(8);
    });

    it('container', function() {
      expect(this.blot.descendants(ContainerBlot).length).toEqual(3);
    });

    it('leaf', function() {
      expect(this.blot.descendants(LeafBlot).length).toEqual(5);
    });

    it('embed', function() {
      expect(this.blot.descendants(EmbedBlot).length).toEqual(1);
    });

    it('range', function() {
      expect(this.blot.descendants(TextBlot, 1, 3).length).toEqual(2);
    });
  });
});
