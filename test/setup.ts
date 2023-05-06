import Registry from '../src/registry';

import ScrollBlot from '../src/blot/scroll';
import BlockBlot from '../src/blot/block';
import InlineBlot from '../src/blot/inline';
import TextBlot from '../src/blot/text';
import {
  AuthorBlot,
  BoldBlot,
  ItalicBlot,
  ScriptBlot,
} from './registry/inline';
import { Align, Color, Family, Id, Indent, Size } from './registry/attributor';
import { HeaderBlot } from './registry/block';
import { ImageBlot, VideoBlot } from './registry/embed';
import { ListContainer, ListItem } from './registry/list';
import { BreakBlot } from './registry/break';

const getTestRegistry = () => {
  const reg = new Registry();

  reg.register(ScrollBlot);
  reg.register(BlockBlot);
  reg.register(InlineBlot);
  reg.register(TextBlot);
  reg.register(AuthorBlot, BoldBlot, ItalicBlot, ScriptBlot);

  reg.register(Color, Size, Family, Id, Align, Indent);
  reg.register(HeaderBlot);
  reg.register(ImageBlot, VideoBlot);
  reg.register(ListItem, ListContainer);
  reg.register(BreakBlot);

  return reg;
};

type TestContext = {
  container: HTMLElement;
  scroll: ScrollBlot;
  registry: Registry;
};

export const setupContextBeforeEach = () => {
  const ctx: TestContext = {} as TestContext;
  beforeEach(() => {
    const container = document.createElement('div');
    const registry = getTestRegistry();
    const scroll = new ScrollBlot(registry, container);
    ctx.container = container;
    ctx.scroll = scroll;
    ctx.registry = registry;
  });
  return ctx;
};
