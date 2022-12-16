class LRUCacheV1 {
  constructor(limit) {
    this.limit = limit
    this.map = new Map()
  }

  get(key) {
    const value = this.map.get(key)

    if (value) {
      this.map.delete(key)
      this.map.set(key, value)
    }

    return value
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key)
    } else if (this.map.size >= this.limit) {
      this.map.delete(this.map.keys().next().value)
    }

    this.map.set(key, value)
  }
}
