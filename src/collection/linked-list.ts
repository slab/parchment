import LinkedNode from './linked-node';


class LinkedList<T extends LinkedNode> {
  head: T;
  tail: T;
  length: number;

  constructor() {
    this.empty();
  }

  append(...nodes: T[]): void {
    this.insertBefore(nodes[0], undefined);
    if (nodes.length > 1) {
      this.append.apply(this, nodes.slice(1));
    }
  }

  empty(): void {
    this.head = this.tail = undefined;
    this.length = 0;
  }

  insertBefore(node: T, refNode: T): void {
    node.next = refNode;
    if (refNode != null) {
      node.prev = refNode.prev;
      if (refNode.prev != null) {
        refNode.prev.next = node;
      }
      refNode.prev = node;
      if (refNode === this.head) {
        this.head = node;
      }
    } else if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    } else {
      node.prev = undefined;
      this.head = this.tail = node;
    }
    this.length += 1;
  }

  offset(target: T): number {
    var offset = 0;
    var cur = this.head;
    while (cur != null) {
      if (cur === target) return offset;
      offset += cur.getLength()
      cur = <T>cur.next;
    }
    return -1;
  }

  remove(node: T): void {
    if (node.prev != null) node.prev.next = node.next;
    if (node.next != null) node.next.prev = node.prev
    if (node === this.head) this.head = <T>node.next;
    if (node === this.tail) this.tail = <T>node.prev;
    this.length -= 1;
  }

  iterator(curNode: T = this.head): () => T {
    // TODO use yield when we can
    return function(): T {
      var ret = curNode;
      if (curNode != null) curNode = <T>curNode.next;
      return ret;
    }
  }

  find(index: number, inclusive: boolean = false): [T, number] {
    var cur, next = this.iterator();
    while (cur = next()) {
      let length = cur.getLength();
      if (index < length || (index === length && inclusive)) {
        return [cur, index];
      }
      index -= length;
    }
    return [null, 0];
  }

  forEach(callback: (cur: T) => void): void {
    var cur, next = this.iterator();
    while (cur = next()) {
      callback(cur);
    }
  }

  forEachAt(index: number, length: number, callback: (cur: T, offset: number, length: number) => void): void {
    if (length <= 0) return;
    var _arr = this.find(index);
    var startNode = _arr[0], offset = _arr[1];
    var cur, curIndex = index - offset, next = this.iterator(startNode);
    while ((cur = next()) && curIndex < index + length) {
      let curLength = cur.getLength();
      if (index <= curIndex) {
        callback(cur, 0, Math.min(curLength, index + length - curIndex));
      } else if (index < curIndex + curLength) {
        callback(cur, index - curIndex, Math.min(length, curIndex + curLength - index));
      }
      curIndex += curLength;
    }
  }

  map(callback: (cur: T) => any): any[] {
    return this.reduce(function(memo, cur: T) {
      memo.push(callback(cur));
      return memo;
    }, []);
  }

  reduce<M>(callback: (memo: M, cur: T) => M, memo: M): M {
    var cur, next = this.iterator();
    while (cur = next()) {
      memo = callback(memo, cur);
    }
    return memo;
  }
}


export default LinkedList;
