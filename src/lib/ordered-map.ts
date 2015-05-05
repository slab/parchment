class OrderedMap {
  protected map: { [id: string]: any };
  protected keys: string[];

  constructor() {
    this.map = {};
    this.keys = [];
  }

  get(key: string): any {
    return this.map[key];
  }

  indexOf(key: string): number {
    return this.keys.indexOf(key);
  }

  has(key: string): boolean {
    return !!this.map[key];
  }

  remove(key): void {
    if (this.has(key)) {
      var index = this.indexOf(key);
      this.keys.splice(index, 1);
      delete this.map[key];
    }
  }

  set(key: string, value): void {
    if (!this.has(key)) {
      this.keys.push(key);
    }
    this.map[key] = value;
  }

  size(): number {
    return this.keys.length;
  }
}


export = OrderedMap;
