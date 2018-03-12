'use strict';

describe('Scroll', function() {
  beforeEach(function() {
    let containerNode = document.createElement('div');
    containerNode.innerHTML =
      '<p><strong>012</strong><span>34</span><em><strong>5678</strong></em></p>';
    this.container = Registry.create(containerNode);
  });

  describe('path()', function() {
    it('middle', function() {
      let path = this.container.path(7);
      let expected = [
        ['scroll', 7],
        ['block', 7],
        ['italic', 2],
        ['bold', 2],
        ['text', 2],
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
        ['scroll', 5],
        ['block', 5],
        ['italic', 0],
        ['bold', 0],
        ['text', 0],
      ];
      expect(path.length).toEqual(expected.length);
      path.forEach(function(position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });

    it('inclusive', function() {
      let path = this.container.path(3, true);
      let expected = [['scroll', 3], ['block', 3], ['bold', 3], ['text', 3]];
      expect(path.length).toEqual(expected.length);
      path.forEach(function(position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });

    it('last', function() {
      let path = this.container.path(9);
      let expected = [['scroll', 9]];
      expect(path.length).toEqual(expected.length);
      path.forEach(function(position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });
  });

  it('delete all', function() {
    let wrapper = document.createElement('div');
    wrapper.appendChild(this.container.domNode);
    this.container.deleteAt(0, 9);
    expect(wrapper.firstChild).toEqual(this.container.domNode);
  });

  it('detach', function(done) {
    let scroll = Registry.create('scroll');
    spyOn(scroll, 'optimize').and.callThrough();
    scroll.domNode.innerHTML = 'Test';
    setTimeout(function() {
      expect(scroll.optimize).toHaveBeenCalledTimes(1);
      scroll.detach();
      scroll.domNode.innerHTML = '!';
      setTimeout(function() {
        expect(scroll.optimize).toHaveBeenCalledTimes(1);
        done();
      }, 1);
    }, 1);
  });

  describe('scroll reference', function() {
    it('initialization', function() {
      expect(this.container.scroll).toEqual(this.container);
      this.container.descendants(blot => {
        expect(blot.scroll).toEqual(this.container);
      });
    });

    it('api change', function() {
      const blot = Registry.create('text', 'Test');
      this.container.appendChild(blot);
      expect(blot.scroll).toEqual(this.container);
    });

    it('user change', function() {
      this.container.domNode.innerHTML = '<p><em>01</em>23</p>';
      this.container.update();
      this.container.descendants(blot => {
        expect(blot.scroll).toEqual(this.container);
      });
    });
  });
});
