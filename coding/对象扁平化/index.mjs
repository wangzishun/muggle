/**
 * 对象扁平化
 * 说明：请实现 flatten(input) 函数，input 为一个 javascript 对象（Object 或者 Array），返回值为扁平化后的结果。
 * 示例：
 *   var input = {
 *     a: 1,
 *     b: [ 1, 2, { c: true }, [ 3 ] ],
 *     d: { e: 2, f: 3 },
 *     g: null,
 *   }
 *   var output = flatten(input);
 *   output如下
 *   {
 *     "a": 1,
 *     "b[0]": 1,
 *     "b[1]": 2,
 *     "b[2].c": true,
 *     "b[3][0]": 3,
 *     "d.e": 2,
 *     "d.f": 3,
 *     // "g": null,  值为null或者undefined，丢弃
 *  }
 */

export const _flatten = (target, previousPath = '', result = {}) => {
  const targetIsArray = Array.isArray(target)

  for (let key in target) {
    const path = targetIsArray ? `${previousPath}[${key}]` : `${previousPath ? `${previousPath}.` : ''}${key}`

    const value = target[key]

    if (value === null || value === undefined) {
      continue
    }

    if (typeof value === 'object') {
      _flatten(value, path, result)
      continue
    }

    result[path] = value
  }

  return result
}
