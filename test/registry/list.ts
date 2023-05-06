import ContainerBlot from '../../src/blot/abstract/container';
import BlockBlot from '../../src/blot/block';

export class ListItem extends BlockBlot {}
ListItem.blotName = 'list';
ListItem.tagName = 'LI';

export class ListContainer extends ContainerBlot {}
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL';

ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;
