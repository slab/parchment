'use strict';

describe('Parent', function() {
  beforeEach(function() {
    let node = document.createElement('p');
    node.innerHTML = '<span>0</span><em>1<strong>2</strong><img></em>4';
    this.blot = Registry.create(node);
  });

  describe('descendants()', function() {
    it('all', function() {
      expect(this.blot.descendants(ShadowBlot).length).toEqual(8);
    });

    it('container', function() {
      expect(this.blot.descendants(ParentBlot).length).toEqual(3);
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
      expect(
        this.blot.descendants(
          function(blot) {
            return blot instanceof TextBlot;
          },
          1,
          3,
        ).length,
      ).toEqual(2);
    });
  });

  describe('descendant', function() {
    it('index', function() {
      let [blot, offset] = this.blot.descendant(ItalicBlot, 3);
      expect(blot instanceof ItalicBlot).toBe(true);
      expect(offset).toEqual(2);
    });

    it('function match', function() {
      let [blot, offset] = this.blot.descendant(function(blot) {
        return blot instanceof ItalicBlot;
      }, 3);
      expect(blot instanceof ItalicBlot).toBe(true);
      expect(offset).toEqual(2);
    });

    it('no match', function() {
      let [blot, offset] = this.blot.descendant(VideoBlot, 1);
      expect(blot).toEqual(null);
      expect(offset).toEqual(-1);
    });
  });

  it('detach()', function() {
    expect(this.blot.domNode[Registry.DATA_KEY]).toEqual({ blot: this.blot });
    expect(this.blot.descendants(ShadowBlot).length).toEqual(8);
    this.blot.detach();
    expect(this.blot.domNode[Registry.DATA_KEY]).toEqual(undefined);
    this.blot.descendants(ShadowBlot).forEach(blot => {
      expect(this.blot.domNode[Registry.DATA_KEY]).toEqual(undefined);
    });
  });

  it('attach unknown blot', function() {
    let node = document.createElement('p');
    node.appendChild(document.createElement('input'));
    expect(function() {
      Registry.create(node);
    }).not.toThrowError(/\[Parchment\]/);
  });

  it('allowedChildren', function() {
    HeaderBlot.allowedChildren = [BoldBlot];
    let node = document.createElement('h1');
    node.innerHTML = 'Test';
    expect(function() {
      let blot = Registry.create(node);
      blot.insertAt(2, 'image', true);
    }).toThrowError(/\[Parchment\]/);
    HeaderBlot.allowedChildren = undefined;
  });
});
