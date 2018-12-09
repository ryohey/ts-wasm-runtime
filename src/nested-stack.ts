import { Stack } from "./stack"

export class NestedStack<T> {
  private stacks: Stack<Stack<T>> = new Stack()

  constructor() {
    this.stacks.push(new Stack())
  }

  private get current(): Stack<T> {
    return this.stacks.peek()
  }

  push(value: T) {
    this.current.push(value)
  }

  pop() {
    return this.current.pop()
  }

  peek() {
    return this.current.peek()
  }

  popStack() {
    this.stacks.pop()
  }

  pushStack() {
    this.stacks.push(new Stack())
  }
}
