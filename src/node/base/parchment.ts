interface ParchmentNode {
  // static nodeName: string;
  // static scope: Registry.Scope;
  // constructor(value: Node, NodeClass);    // TODO not sure why this breaks things

  // formats(): any;
  // values(): any;

  insertAt(index: number, value: string, def?: any): void;
  formatAt(index: number, length: number, name: string, value: any): void;
  deleteAt(index: number, length: number): void;
}


export = ParchmentNode;
