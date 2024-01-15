import { assertType } from 'vitest';
import { ClassAttributor } from '../../src/parchment';

class IndentAttributor extends ClassAttributor {
  value(node: HTMLElement) {
    return parseInt(super.value(node), 10) || undefined;
  }
}

assertType<any>(
  new IndentAttributor('indent', 'indent').value(document.createElement('div')),
);
