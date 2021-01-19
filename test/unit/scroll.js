'use strict';

describe('Scroll', function () {
  beforeEach(function () {
    this.container.innerHTML =
      '<p><strong>012</strong><span>34</span><em><strong>5678</strong></em></p>';
    this.scroll.update();
  });

  describe('path()', function () {
    it('middle', function () {
      let path = this.scroll.path(7);
      let expected = [
        ['scroll', 7],
        ['block', 7],
        ['italic', 2],
        ['bold', 2],
        ['text', 2],
      ];
      expect(path.length).toEqual(expected.length);
      path.forEach(function (position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });

    it('between blots', function () {
      let path = this.scroll.path(5);
      let expected = [
        ['scroll', 5],
        ['block', 5],
        ['italic', 0],
        ['bold', 0],
        ['text', 0],
      ];
      expect(path.length).toEqual(expected.length);
      path.forEach(function (position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });

    it('inclusive', function () {
      let path = this.scroll.path(3, true);
      let expected = [
        ['scroll', 3],
        ['block', 3],
        ['bold', 3],
        ['text', 3],
      ];
      expect(path.length).toEqual(expected.length);
      path.forEach(function (position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });

    it('last', function () {
      let path = this.scroll.path(9);
      let expected = [['scroll', 9]];
      expect(path.length).toEqual(expected.length);
      path.forEach(function (position, i) {
        expect(position[0].statics.blotName).toEqual(expected[i][0]);
        expect(position[1]).toEqual(expected[i][1]);
      });
    });
  });

  it('delete all', function () {
    let wrapper = document.createElement('div');
    wrapper.appendChild(this.scroll.domNode);
    this.scroll.deleteAt(0, 9);
    expect(wrapper.firstChild).toEqual(this.scroll.domNode);
  });

  it('detach', function (done) {
    spyOn(this.scroll, 'optimize').and.callThrough();
    this.scroll.domNode.innerHTML = 'Test';
    setTimeout(() => {
      expect(this.scroll.optimize).toHaveBeenCalledTimes(1);
      this.scroll.detach();
      this.scroll.domNode.innerHTML = '!';
      setTimeout(() => {
        expect(this.scroll.optimize).toHaveBeenCalledTimes(1);
        done();
      }, 1);
    }, 1);
  });

  describe('scroll reference', function () {
    it('initialization', function () {
      expect(this.scroll.scroll).toEqual(this.scroll);
      this.scroll.descendants((blot) => {
        expect(blot.scroll).toEqual(this.scroll);
      });
    });

    it('api change', function () {
      const blot = this.scroll.create('text', 'Test');
      this.scroll.appendChild(blot);
      expect(blot.scroll).toEqual(this.scroll);
    });

    it('user change', function () {
      this.scroll.domNode.innerHTML = '<p><em>01</em>23</p>';
      this.scroll.update();
      this.scroll.descendants((blot) => {
        expect(blot.scroll).toEqual(this.scroll);
      });
    });
  });
});
