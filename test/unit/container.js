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

    it('function match', function() {
      expect(this.blot.descendants(function(blot) {
        return blot instanceof TextBlot;
      }, 1, 3).length).toEqual(2);
    });
  });

  describe('detach()', function() {
    it('destroy', function() {
      let node = document.createElement('p');
      let blot = Registry.create(node);
      expect(blot.domNode[Registry.DATA_KEY]).toEqual({blot: blot});
      expect(blot.descendants(ShadowBlot).length).toEqual(0);
      blot.detach();
      expect(blot.domNode[Registry.DATA_KEY]).toEqual(undefined);
    });

    it('detach + children', function() {
      let node = document.createElement('p');
      node.innerHTML = '<span>0</span><em>1<strong>2</strong><img></em>4';
      let blot = Registry.create(node);
      expect(blot.domNode[Registry.DATA_KEY]).toEqual({blot: blot});
      expect(blot.descendants(ShadowBlot).length).toEqual(8);
      blot.detach();
      expect(blot.domNode[Registry.DATA_KEY]).toEqual(undefined);
      blot.descendants(ShadowBlot).forEach(function(blot) {
        expect(blot.domNode[Registry.DATA_KEY]).toEqual(undefined);
      });
    });
  })
});
