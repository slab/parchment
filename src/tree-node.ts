interface TreeNode {
  prev: TreeNode;
  next: TreeNode;
  parent: TreeNode;

  length(): number;
}


export = TreeNode;
