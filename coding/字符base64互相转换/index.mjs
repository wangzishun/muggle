/**
 * btoa 方式
 */

// const base64Encode

// Base64 是一种基于 64 个可打印字符来表示二进制数据的表示方法。由于 2⁶ = 64 ，所以每 6 个比特为一个单元，对应某个可打印字符。3 个字节有 24 个比特，对应于 4 个 base64 单元，即 3 个字节可由 4 个可打印字符来表示

// 1 byte = 8 bit
// 1 base64 unit = 6 bit
// 3 byte = 24 bit = 4 base64 unit

// 原始数据块： 01001000 01100101 01101100
// 拆分为 6 位二进制数： 010010 000110 010101 101100
// Base64 编码单元： S G V s

const str = 'h1好'
// const str = 'hallo world, 你好'

const utf8EncodeByLoop = (str) => {
  const bytes = []

  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i)

    // 1-byte sequence (0x00-0x7F)
    // 对于 Unicode 码点值小于 0x80 的字符，其对应的 UTF-8 编码为一个字节，其值等于 Unicode 码点值
    if (charCode < 0x80) {
      bytes.push(charCode)
    }
    // 2-byte sequence (0x80-0x7FF)
    // 对于 Unicode 码点值大于等于 0x80 且小于 0x800 的字符，其对应的 UTF-8 编码为两个字节，
    // 第一个字节的前 5 位为 0xC0，后 6 位为 Unicode 码点值的高 5 位；
    // 第二个字节的前两位为 0x80，后 6 位为 Unicode 码点值的低 6 位
    else if (charCode < 0x800) {
      bytes.push(0xc0 | ((charCode >> 6) & 0x1f))
      bytes.push(0x80 | (charCode & 0x3f))
    }
    // 3-byte sequence (0x800-0xFFFF)
    // 对于 Unicode 码点值大于等于 0x800 且小于 0x10000 的字符，其对应的 UTF-8 编码为三个字节，
    // 第一个字节的前 4 位为 0xE0，后 4 位为 Unicode 码点值的高 4 位；
    // 第二个字节的前两位为 0x80，后 6 位为 Unicode 码点值的中间 6 位；
    // 第三个字节的前两位也为 0x80，后 6 位为 Unicode 码点值的低 6 位
    else if (charCode < 0x10000) {
      bytes.push(0xe0 | ((charCode >> 12) & 0xf))
      bytes.push(0x80 | ((charCode >> 6) & 0x3f))
      bytes.push(0x80 | (charCode & 0x3f))
    }
    // 4-byte sequence (0x10000-0x10FFFF)
    // 对于 Unicode 码点值大于等于 0x10000 且小于 0x110000 的字符，其对应的 UTF-8 编码为四个字节，
    // 第一个字节的前 3 位为 0xF0，后 4 位为 Unicode 码点值的高 3 位；
    // 第二个字节的前两位为 0x80，后 6 位为 Unicode 码点值的第 2 到第 7 位；
    // 第三个字节的前两位也为 0x80，后 6 位为 Unicode 码点值的第 8 到第 13 位；
    // 第四个字节的前两位也为 0x80，后 6 位为 Unicode 码点值的低 6 位
    else {
      bytes.push(0xf0 | ((charCode >> 18) & 0x7))
      bytes.push(0x80 | ((charCode >> 12) & 0x3f))
      bytes.push(0x80 | ((charCode >> 6) & 0x3f))
      bytes.push(0x80 | (charCode & 0x3f))
    }
  }

  return bytes
}

/**
 *
 */
const bytesToBase64ByLoop = (bytes) => {
  const asciiTable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  const base64Table = [...asciiTable].slice(0, 64)
  const paddingChar = asciiTable.charAt(64)

  let result = ''
  let i = 0
  while (i < bytes.length) {
    const byte1 = bytes[i++] || 0
    const byte2 = bytes[i++] || 0
    const byte3 = bytes[i++] || 0
    const group = ((byte1 << 16) | (byte2 << 8) | byte3).toString(2).padStart(24, '0')
    const codes = [group.slice(0, 6), group.slice(6, 12), group.slice(12, 18), group.slice(18, 24)]
    codes.forEach((code, index) => {
      const charIndex = parseInt(code, 2)
      result += base64Table[charIndex]
      if (index === codes.length - 1 && byte3 === 0) {
        result += paddingChar
      }
    })
  }

  return result
}

const base64EncodeV1 = (str) => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)

  return btoa(String.fromCharCode(...bytes))
}

const base64EncodeV2 = (str) => {
  return Buffer.from(str, 'utf8').toString('base64') // 将字符串转换为 Buffer
}

const base64EncodeV3 = (str) => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)

  return bytesToBase64ByLoop(bytes)
}

const base64EncodeV4 = (str) => {
  const bytes = utf8EncodeByLoop(str)

  const base64 = btoa(String.fromCharCode(...bytes))
  return base64
}

console.log(base64EncodeV1(str)) // 优先给我第一个版本
console.log(base64EncodeV2(str)) // 其次给我第二个版本

console.log(base64EncodeV3(str))
