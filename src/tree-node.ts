interface TreeNode {
  prev: TreeNode;
  next: TreeNode;
  parent: TreeNode;

  getLength(): number;
}


export = TreeNode;
