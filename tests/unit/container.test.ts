import { describe, it, expect, beforeEach } from 'vitest';
import { setupContextBeforeEach } from '../setup';

describe('Container', function () {
  const ctx = setupContextBeforeEach();

  beforeEach(function () {
    ctx.container.innerHTML = '<ol><li>1</li></ol>';
  });

  describe('enforceAllowedChildren()', function () {
    it('keep allowed', function () {
      const li = document.createElement('li');
      li.innerHTML = '2';
      ctx.scroll.domNode.firstChild?.appendChild(li);
      ctx.scroll.update();
      expect(ctx.scroll.domNode.innerHTML).toEqual(
        '<ol><li>1</li><li>2</li></ol>',
      );
    });

    it('remove unallowed child', function () {
      const strong = document.createElement('strong');
      strong.innerHTML = '2';
      ctx.scroll.domNode.firstChild?.appendChild(strong);
      ctx.scroll.update();
      expect(ctx.scroll.domNode.innerHTML).toEqual('<ol><li>1</li></ol>');
    });

    it('isolate block', function () {
      const header = document.createElement('h1');
      header.innerHTML = '2';
      ctx.scroll.domNode.firstChild?.appendChild(header);
      ctx.scroll.update();
      expect(ctx.scroll.domNode.innerHTML).toEqual(
        '<ol><li>1</li></ol><h1>2</h1>',
      );
    });
  });
});
