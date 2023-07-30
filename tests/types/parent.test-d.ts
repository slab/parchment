import { assertType } from 'vitest';
import {
  type Blot,
  EmbedBlot,
  Registry,
  ScrollBlot,
  ParentBlot,
} from '../../src/parchment';

const registry = new Registry();
const root = document.createElement('div');
const scroll = new ScrollBlot(registry, root);

// ParentBlot#descendant()
{
  const parent = new ParentBlot(scroll, document.createElement('div'));
  assertType<[EmbedBlot | null, number]>(parent.descendant(EmbedBlot, 12));
  assertType<[Blot | null, number]>(parent.descendant(() => true, 12));
}

// ParentBlot#descendants()
{
  const parent = new ParentBlot(scroll, document.createElement('div'));
  assertType<EmbedBlot[]>(parent.descendants(EmbedBlot));
  assertType<EmbedBlot[]>(parent.descendants(EmbedBlot, 12));
  assertType<EmbedBlot[]>(parent.descendants(EmbedBlot, 12, 2));
  assertType<Blot[]>(parent.descendants(() => true));
  assertType<Blot[]>(parent.descendants(() => true, 12));
  assertType<Blot[]>(parent.descendants(() => true, 12, 2));
}
