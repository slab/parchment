interface LinkedNode {
  prev: LinkedNode;
  next: LinkedNode;

  length(): number;
}


export = LinkedNode;
