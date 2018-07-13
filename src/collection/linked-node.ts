interface ILinkedNode {
  prev: ILinkedNode | null;
  next: ILinkedNode | null;

  length(): number;
}

export default ILinkedNode;
