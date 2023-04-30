import { expectType } from 'tsd';
import { Blot, EmbedBlot, Registry, ScrollBlot, ParentBlot } from '..';

const registry = new Registry();
const root = document.createElement('div');
const scroll = new ScrollBlot(registry, root);

// ParentBlot#descendant()
{
  const parent = new ParentBlot(scroll, document.createElement('div'));
  expectType<[EmbedBlot | null, number]>(parent.descendant(EmbedBlot, 12));
  expectType<[Blot | null, number]>(parent.descendant(() => true, 12));
}

// ParentBlot#descendants()
{
  const parent = new ParentBlot(scroll, document.createElement('div'));
  expectType<EmbedBlot[]>(parent.descendants(EmbedBlot));
  expectType<EmbedBlot[]>(parent.descendants(EmbedBlot, 12));
  expectType<EmbedBlot[]>(parent.descendants(EmbedBlot, 12, 2));
  expectType<Blot[]>(parent.descendants(() => true));
  expectType<Blot[]>(parent.descendants(() => true, 12));
  expectType<Blot[]>(parent.descendants(() => true, 12, 2));
}
