import LeafBlot from '../../src/blot/abstract/leaf';
import ParentBlot from '../../src/blot/abstract/parent';
import ShadowBlot from '../../src/blot/abstract/shadow';
import EmbedBlot from '../../src/blot/embed';

import { VideoBlot } from '../registry/embed';
import { ItalicBlot } from '../registry/inline';

import Registry from '../../src/registry';
import TextBlot from '../../src/blot/text';
import { setupContextBeforeEach } from '../setup';
import type { BlockBlot, Blot } from '../../src/parchment';

describe('Parent', function () {
  const ctx = setupContextBeforeEach();

  let testBlot!: BlockBlot;

  beforeEach(function () {
    let node = document.createElement('p');
    node.innerHTML = '<span>0</span><em>1<strong>2</strong><img></em>4';
    testBlot = ctx.registry.create(ctx.scroll, node) as BlockBlot;
  });

  describe('descendants()', function () {
    it('all', function () {
      expect(testBlot.descendants(ShadowBlot).length).toEqual(8);
    });

    it('container', function () {
      expect(testBlot.descendants(ParentBlot).length).toEqual(3);
    });

    it('leaf', function () {
      expect(testBlot.descendants(LeafBlot).length).toEqual(5);
    });

    it('embed', function () {
      expect(testBlot.descendants(EmbedBlot).length).toEqual(1);
    });

    it('range', function () {
      expect(testBlot.descendants(TextBlot, 1, 3).length).toEqual(2);
    });

    it('function match', function () {
      expect(
        testBlot.descendants(
          function (blot: Blot) {
            return blot instanceof TextBlot;
          },
          1,
          3,
        ).length,
      ).toEqual(2);
    });
  });

  describe('descendant', function () {
    it('index', function () {
      let [blot, offset] = testBlot.descendant(ItalicBlot, 3);
      expect(blot instanceof ItalicBlot).toBe(true);
      expect(offset).toEqual(2);
    });

    it('function match', function () {
      let [blot, offset] = testBlot.descendant(function (blot: Blot) {
        return blot instanceof ItalicBlot;
      }, 3);
      expect(blot instanceof ItalicBlot).toBe(true);
      expect(offset).toEqual(2);
    });

    it('no match', function () {
      let [blot, offset] = testBlot.descendant(VideoBlot, 1);
      expect(blot).toEqual(null);
      expect(offset).toEqual(-1);
    });
  });

  it('detach()', function () {
    expect(Registry.blots.get(testBlot.domNode)).toEqual(testBlot);
    expect(testBlot.descendants(ShadowBlot).length).toEqual(8);
    testBlot.detach();
    expect(Registry.blots.has(testBlot.domNode)).toBe(false);
    testBlot.descendants(ShadowBlot).forEach((blot) => {
      expect(Registry.blots.has(blot.domNode)).toBe(false);
    });
  });

  it('attach unknown blot', function () {
    let node = document.createElement('p');
    node.appendChild(document.createElement('input'));
    expect(() => {
      ctx.scroll.create(node);
    }).not.toThrowError(/\[Parchment\]/);
  });

  it('ignore added uiNode', function () {
    ctx.scroll.appendChild(testBlot);
    testBlot.attachUI(document.createElement('div'));
    ctx.scroll.update();
    expect(ctx.scroll.domNode.innerHTML).toEqual(
      '<p><div contenteditable="false"></div>0<em>1<strong>2</strong><img></em>4</p>',
    );
  });

  it('allowedChildren', function () {
    ctx.scroll.domNode.innerHTML = '<p>A</p>B<span>C</span><p>D</p>';
    ctx.scroll.update();
    expect(ctx.scroll.domNode.innerHTML).toEqual('<p>A</p><p>D</p>');
  });
});
