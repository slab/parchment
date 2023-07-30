import { beforeEach } from 'vitest';

import {
  Registry,
  ScrollBlot,
  BlockBlot,
  InlineBlot,
  TextBlot,
  type BlotConstructor,
} from '../src/parchment';
import {
  AuthorBlot,
  BoldBlot,
  ItalicBlot,
  ScriptBlot,
} from './__helpers__/registry/inline';
import {
  Align,
  Color,
  Family,
  Id,
  Indent,
  Size,
} from './__helpers__/registry/attributor';
import { HeaderBlot } from './__helpers__/registry/block';
import { ImageBlot, VideoBlot } from './__helpers__/registry/embed';
import { ListContainer, ListItem } from './__helpers__/registry/list';
import { BreakBlot } from './__helpers__/registry/break';

const getTestRegistry = () => {
  const reg = new Registry();

  reg.register(ScrollBlot as unknown as BlotConstructor);
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
  const ctx = {} as TestContext;
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
