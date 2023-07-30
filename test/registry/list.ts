import ContainerBlot from '../../src/blot/abstract/container';
import BlockBlot from '../../src/blot/block';

export class ListItem extends BlockBlot {
  static readonly blotName = 'list';
  static tagName = 'LI';
}

export class ListContainer extends ContainerBlot {
  static readonly blotName = 'list-container';
  static tagName = 'OL';
  static allowedChildren = [ListItem];
}

// Can only define outside of ListItem class due to used-before-declaration error
ListItem.requiredContainer = ListContainer;
