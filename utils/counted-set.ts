export class CountedSet<T> {
  private map: Map<T, number> = new Map()

  add(value: T) {
    this.map.set(value, (this.map.get(value) || 0) + 1)
  }

  get(value: T) {
    return this.map.get(value) || 0
  }

  delete(value: T) {
    const count = this.map.get(value)
    if (count === undefined) return
    if (count === 1) {
      this.map.delete(value)
    } else {
      this.map.set(value, count - 1)
    }
  }

  clear() {
    this.map.clear()
  }

  get size() {
    return this.map.size
  }

  get entries() {
    return this.map.entries()
  }

  get values() {
    return this.map.values()
  }

  get keys() {
    return this.map.keys()
  }

  [Symbol.iterator]() {
    return this.map[Symbol.iterator]()
  }
}
