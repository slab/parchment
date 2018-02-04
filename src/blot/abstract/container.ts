import ParentBlot from './parent';
import BlockBlot from '../block';
import * as Registry from '../../registry';

class ContainerBlot extends ParentBlot {
  static blotName = 'container';
  static scope = Registry.Scope.BLOCK_BLOT;
  static tagName: string;
  static allowedChildren: Registry.BlotConstructor[] = [BlockBlot, ContainerBlot];
  static defaultChild = BlockBlot;
}

export default ContainerBlot;
