export class Stack<T> {
  private arr: T[] = []

  push(value: T) {
    this.arr.push(value)
  }

  pop() {
    if (this.arr.length === 0) {
      throw new Error("Stack is empty")
    }
    return this.arr.pop()
  }

  peek() {
    if (this.arr.length === 0) {
      throw new Error("Stack is empty")
    }
    return this.arr[this.arr.length - 1]
  }
}
