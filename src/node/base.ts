interface ParchmentNode {
  // static nodeName: string;
  // static scope: Registry.Scope;
  init(value: any): any;

  formats(): any;
  values(): any;

  insertAt(index: number, value: string, def?: any): void;
  formatAt(index: number, length: number, name: string, value: any): void;
  deleteAt(index: number, length: number): void;
}

export = ParchmentNode;
