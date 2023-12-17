// deno-lint-ignore no-explicit-any
export declare type Item = any
export declare type Comparator<Item> = (a: Item, b: Item) => number

// from npm:tinyqueue
export class PriorityQueue<Item> {
  public data: Item[]
  public length: number
  private compare: Comparator<Item>

  constructor(data: Item[] = [], compare: Comparator<Item> = defaultCompare) {
    this.data = data
    this.length = this.data.length
    this.compare = compare

    if (this.length > 0) {
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i)
    }
  }

  push(item: Item) {
    this.data.push(item)
    this._up(this.length++)
  }

  pop() {
    if (this.length === 0) return undefined

    const top = this.data[0]
    const bottom = this.data.pop()

    if (--this.length > 0) {
      this.data[0] = bottom!
      this._down(0)
    }

    return top
  }

  peek() {
    return this.data[0]
  }

  _up(pos: number) {
    const { data, compare } = this
    const item = data[pos]

    while (pos > 0) {
      const parent = (pos - 1) >> 1
      const current = data[parent]
      if (compare(item, current) >= 0) break
      data[pos] = current
      pos = parent
    }

    data[pos] = item
  }

  _down(pos: number) {
    const { data, compare } = this
    const halfLength = this.length >> 1
    const item = data[pos]

    while (pos < halfLength) {
      let bestChild = (pos << 1) + 1 // initially it is the left child
      const right = bestChild + 1

      if (right < this.length && compare(data[right], data[bestChild]) < 0) {
        bestChild = right
      }
      if (compare(data[bestChild], item) >= 0) break

      data[pos] = data[bestChild]
      pos = bestChild
    }

    data[pos] = item
  }
}

function defaultCompare(a: Item, b: Item) {
  return a < b ? -1 : a > b ? 1 : 0
}
