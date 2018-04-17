'use strict';

class ListItem extends BlockBlot {}
ListItem.blotName = 'list';
ListItem.tagName = 'LI';

class ListContainer extends ContainerBlot {}
ListContainer.blotName = 'list-container';
ListContainer.tagName = 'OL';

ListContainer.allowedChildren = [ListItem];
ListItem.requiredContainer = ListContainer;

Registry.register(ListItem);
Registry.register(ListContainer);
