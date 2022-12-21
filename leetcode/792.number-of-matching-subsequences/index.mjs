/**
 * @description 792. 匹配子序列的单词数
 * @see https://leetcode-cn.com/problems/number-of-matching-subsequences
 */

/**
 *
 * @param {*} S
 * @param {*} words
 * @returns
 */
export const numMatchingSubseqV1 = (S, words) => {
  const length = S.length

  /**
   * [word, length, matchIndex]
   * 存储每个单词的长度，以及当前匹配到的索引位置
   */
  const wordsTemp = words.map((word) => [word, word.length, 0])

  let count = 0

  for (let i = 0; i < length; i++) {
    const current = S[i]

    if (wordsTemp.length === 0) {
      break
    }

    for (let j = 0; j < wordsTemp.length; j++) {
      const [word, wordLength, matchIndex] = wordsTemp[j]

      if (word[matchIndex] !== current) {
        continue
      }

      /** matchIndex 索引后移，判断这个字符是否配对完成  */
      wordsTemp[j][2] += 1
      if (wordsTemp[j][2] === wordLength) {
        count++

        /** 删除已经配对完成的单词 */
        wordsTemp.splice(j, 1)
        i--
      }
    }
  }

  return count
}

export const numMatchingSubseqV2 = (S, words) => {
  const length = S.length

  const map = new Map()

  for (let i = 0; i < length; i++) {
    const current = S[i]

    if (!map.has(current)) {
      map.set(current, [])
    }
    map.get(current).push(i)
  }

  let count = 0

  for (let word of words) {
    const len = word.length

    /** 上一个匹配的字符在 s 中的位置 */
    let previousIndex = -1
    for (let i = 0; i < len; i++) {
      const current = word[i]

      /** 获取当前字符在 s 中的位置列表 */
      const indexList = map.get(current)
      if (indexList === undefined) {
        break
      }

      /** 在位置列表中找到比上一次位置更靠后的位置 */
      const index = indexList.find((i) => i > previousIndex)
      if (index === undefined) {
        break
      }

      previousIndex = index

      if (i === len - 1) {
        count++
      }
    }
  }

  return count
}
