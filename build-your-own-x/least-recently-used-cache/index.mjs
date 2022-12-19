/**
 *
 *
 */
export function _createLeastRecentlyUsedCache(limit) {
  const map = new Map()

  const get = (key) => {
    const value = map.get(key)

    if (value) {
      map.delete(key)
      map.set(key, value)
    }

    return value
  }

  const set = (key, value) => {
    if (map.has(key)) {
      map.delete(key)
    } else if (map.size >= limit) {
      map.delete(map.keys().next().value)
    }

    map.set(key, value)
  }

  return { get, set }
}
