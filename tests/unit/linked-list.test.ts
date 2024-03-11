import { vi, describe, it, expect, beforeEach } from 'vitest';
import LinkedList from '../../src/collection/linked-list.js';
import type { LinkedNode } from '../../src/parchment.js';

interface StrNode extends LinkedNode {
  str: string;
}

const setupContextBeforeEach = () => {
  const getContext = () => {
    const length = () => 3;
    return {
      list: new LinkedList<StrNode>(),
      a: { str: 'a', length } as StrNode,
      b: { str: 'b', length } as StrNode,
      c: { str: 'c', length } as StrNode,
      zero: { str: '!', length: () => 0 } as StrNode,
    };
  };
  const ctx = getContext();
  beforeEach(function () {
    Object.assign(ctx, getContext());
  });
  return ctx;
};

describe('LinkedList', function () {
  const ctx = setupContextBeforeEach();

  describe('manipulation', function () {
    it('append to empty list', function () {
      ctx.list.append(ctx.a);
      expect(ctx.list.length).toBe(1);
      expect(ctx.list.head).toBe(ctx.a);
      expect(ctx.list.tail).toBe(ctx.a);
      expect(ctx.a.prev).toBeNull();
      expect(ctx.a.next).toBeNull();
    });

    it('insert to become head', function () {
      ctx.list.append(ctx.b);
      ctx.list.insertBefore(ctx.a, ctx.b);
      expect(ctx.list.length).toBe(2);
      expect(ctx.list.head).toBe(ctx.a);
      expect(ctx.list.tail).toBe(ctx.b);
      expect(ctx.a.prev).toBeNull();
      expect(ctx.a.next).toBe(ctx.b);
      expect(ctx.b.prev).toBe(ctx.a);
      expect(ctx.b.next).toBeNull();
    });

    it('insert to become tail', function () {
      ctx.list.append(ctx.a);
      ctx.list.insertBefore(ctx.b, null);
      expect(ctx.list.length).toBe(2);
      expect(ctx.list.head).toBe(ctx.a);
      expect(ctx.list.tail).toBe(ctx.b);
      expect(ctx.a.prev).toBeNull();
      expect(ctx.a.next).toBe(ctx.b);
      expect(ctx.b.prev).toBe(ctx.a);
      expect(ctx.b.next).toBeNull();
    });

    it('insert in middle', function () {
      ctx.list.append(ctx.a, ctx.c);
      ctx.list.insertBefore(ctx.b, ctx.c);
      expect(ctx.list.length).toBe(3);
      expect(ctx.list.head).toBe(ctx.a);
      expect(ctx.a.next).toBe(ctx.b);
      expect(ctx.b.next).toBe(ctx.c);
      expect(ctx.list.tail).toBe(ctx.c);
    });

    it('remove head', function () {
      ctx.list.append(ctx.a, ctx.b);
      ctx.list.remove(ctx.a);
      expect(ctx.list.length).toBe(1);
      expect(ctx.list.head).toBe(ctx.b);
      expect(ctx.list.tail).toBe(ctx.b);
      expect(ctx.list.head?.prev).toBeNull();
      expect(ctx.list.tail?.next).toBeNull();
    });

    it('remove tail', function () {
      ctx.list.append(ctx.a, ctx.b);
      ctx.list.remove(ctx.b);
      expect(ctx.list.length).toBe(1);
      expect(ctx.list.head).toBe(ctx.a);
      expect(ctx.list.tail).toBe(ctx.a);
      expect(ctx.list.head?.prev).toBeNull();
      expect(ctx.list.tail?.next).toBeNull();
    });

    it('remove inner', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      ctx.list.remove(ctx.b);
      expect(ctx.list.length).toBe(2);
      expect(ctx.list.head).toBe(ctx.a);
      expect(ctx.list.tail).toBe(ctx.c);
      expect(ctx.list.head?.prev).toBeNull();
      expect(ctx.list.tail?.next).toBeNull();
      expect(ctx.a.next).toBe(ctx.c);
      expect(ctx.c.prev).toBe(ctx.a);
      // Maintain references
      expect(ctx.b.prev).toBe(ctx.a);
      expect(ctx.b.next).toBe(ctx.c);
    });

    it('remove only node', function () {
      ctx.list.append(ctx.a);
      ctx.list.remove(ctx.a);
      expect(ctx.list.length).toBe(0);
      expect(ctx.list.head).toBeNull();
      expect(ctx.list.tail).toBeNull();
    });

    it('contains', function () {
      ctx.list.append(ctx.a, ctx.b);
      expect(ctx.list.contains(ctx.a)).toBe(true);
      expect(ctx.list.contains(ctx.b)).toBe(true);
      expect(ctx.list.contains(ctx.c)).toBe(false);
    });

    it('move', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      ctx.list.remove(ctx.b);
      ctx.list.remove(ctx.a);
      ctx.list.remove(ctx.c);
      ctx.list.append(ctx.b);
      expect(ctx.b.prev).toBeNull();
      expect(ctx.b.next).toBeNull();
    });
  });

  describe('iteration', function () {
    const spy = vi.fn();
    beforeEach(function () {
      spy.mockReset();
    });

    it('iterate over empty list', function () {
      ctx.list.forEach(spy);
      expect(spy.mock.calls.length).toBe(0);
    });

    it('iterate non-head start', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      const next = ctx.list.iterator(ctx.b);
      const b = next();
      const c = next();
      const d = next();
      expect(b).toBe(ctx.b);
      expect(c).toBe(ctx.c);
      expect(d).toBeNull();
    });

    it('find', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.zero, ctx.c);
      expect(ctx.list.find(0)).toEqual([ctx.a, 0]);
      expect(ctx.list.find(2)).toEqual([ctx.a, 2]);
      expect(ctx.list.find(6)).toEqual([ctx.c, 0]);
      expect(ctx.list.find(3, true)).toEqual([ctx.a, 3]);
      expect(ctx.list.find(6, true)).toEqual([ctx.zero, 0]);
      expect(ctx.list.find(3)).toEqual([ctx.b, 0]);
      expect(ctx.list.find(4)).toEqual([ctx.b, 1]);
      expect(ctx.list.find(10)).toEqual([null, 0]);
    });

    it('offset', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      expect(ctx.list.offset(ctx.a)).toBe(0);
      expect(ctx.list.offset(ctx.b)).toBe(3);
      expect(ctx.list.offset(ctx.c)).toBe(6);
      // @ts-expect-error Testing invalid usage
      expect(ctx.list.offset({})).toBe(-1);
    });

    it('forEach', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      ctx.list.forEach(spy);
      expect(spy.mock.calls.length).toBe(3);
      const result = spy.mock.calls.reduce(
        (memo: string, call: StrNode[]) => memo + call[0].str,
        '',
      );
      expect(result).toBe('abc');
    });

    it('destructive modification', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      const arr: string[] = [];
      ctx.list.forEach((node) => {
        arr.push(node.str);
        if (node === ctx.a) {
          ctx.list.remove(ctx.a);
          ctx.list.remove(ctx.b);
          ctx.list.append(ctx.a);
        }
      });
      expect(arr).toEqual(['a', 'b', 'c', 'a']);
    });

    it('map', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      const arr = ctx.list.map(function (node) {
        return node.str;
      });
      expect(arr).toEqual(['a', 'b', 'c']);
    });

    it('reduce', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      const memo = ctx.list.reduce(function (memo, node) {
        return memo + node.str;
      }, '');
      expect(memo).toBe('abc');
    });

    it('forEachAt', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      ctx.list.forEachAt(3, 3, spy);
      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0]).toEqual([ctx.b, 0, 3]);
    });

    it('forEachAt zero length nodes', function () {
      ctx.list.append(ctx.a, ctx.zero, ctx.c);
      ctx.list.forEachAt(2, 2, spy);
      expect(spy.mock.calls.length).toBe(3);
      const calls = spy.mock.calls;
      expect(calls[0]).toEqual([ctx.a, 2, 1]);
      expect(calls[1]).toEqual([ctx.zero, 0, 0]);
      expect(calls[2]).toEqual([ctx.c, 0, 1]);
    });

    it('forEachAt none', function () {
      ctx.list.append(ctx.a, ctx.b);
      ctx.list.forEachAt(1, 0, spy);
      expect(spy.mock.calls.length).toBe(0);
    });

    it('forEachAt partial nodes', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      ctx.list.forEachAt(1, 7, spy);
      expect(spy.mock.calls.length).toBe(3);
      const calls = spy.mock.calls;
      expect(calls[0]).toEqual([ctx.a, 1, 2]);
      expect(calls[1]).toEqual([ctx.b, 0, 3]);
      expect(calls[2]).toEqual([ctx.c, 0, 2]);
    });

    it('forEachAt at part of single node', function () {
      ctx.list.append(ctx.a, ctx.b, ctx.c);
      ctx.list.forEachAt(4, 1, spy);
      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0]).toEqual([ctx.b, 1, 1]);
    });
  });
});
