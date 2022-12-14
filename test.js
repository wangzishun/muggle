/**
 * 按顺序发送请求， 按顺序输出结果
 */
const serialRequest = (requests) => {
  const result = []
  const length = requests.length

  const processRequest = (count) => {
    if (count >= length) {
      return Promise.resolve(result)
    }

    return requests[count]()
      .then((res) => {
        result[count] = res

        return processRequest(count + 1)
      })
      .catch((err) => {
        return Promise.reject(err)
      })
  }

  return processRequest(0)
}

const request = (url) => () => {
  return new Promise((resolve, reject) => {
    console.log('run', url)
    setTimeout(() => {
      resolve(url + ' success')
    }, 1000)
  })
}

serialRequest([request('a'), request('b'), request('c')]).then((res) => {
  console.log(res)
})

/**
 * 实现建议的 mvvm
 */
