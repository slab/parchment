import { setupContextBeforeEach } from '../setup';

describe('scroll', function () {
  const ctx = setupContextBeforeEach();

  beforeEach(function () {
    ctx.container.innerHTML =
      '<p><strong>012</strong><span>34</span><em><strong>5678</strong></em></p>';
    ctx.scroll.update();
  });

  describe('path()', function () {
    it('middle', function () {
      let path = ctx.scroll.path(7);
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
      let path = ctx.scroll.path(5);
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
      let path = ctx.scroll.path(3, true);
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
      let path = ctx.scroll.path(9);
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
    wrapper.appendChild(ctx.scroll.domNode);
    ctx.scroll.deleteAt(0, 9);
    expect(wrapper.firstChild).toEqual(ctx.scroll.domNode);
  });

  it('detach', function (done) {
    spyOn(ctx.scroll, 'optimize').and.callThrough();
    ctx.scroll.domNode.innerHTML = 'Test';
    setTimeout(() => {
      expect(ctx.scroll.optimize).toHaveBeenCalledTimes(1);
      ctx.scroll.detach();
      ctx.scroll.domNode.innerHTML = '!';
      setTimeout(() => {
        expect(ctx.scroll.optimize).toHaveBeenCalledTimes(1);
        done();
      }, 1);
    }, 1);
  });

  describe('scroll reference', function () {
    it('initialization', function () {
      expect(ctx.scroll).toEqual(ctx.scroll);
      ctx.scroll.descendants((blot) => {
        expect(blot.scroll).toEqual(ctx.scroll);
      });
    });

    it('api change', function () {
      const blot = ctx.scroll.create('text', 'Test');
      ctx.scroll.appendChild(blot);
      expect(blot.scroll).toEqual(ctx.scroll);
    });

    it('user change', function () {
      ctx.scroll.domNode.innerHTML = '<p><em>01</em>23</p>';
      ctx.scroll.update();
      ctx.scroll.descendants((blot) => {
        expect(blot.scroll).toEqual(ctx.scroll);
      });
    });
  });
});
