const createMaxHeapV1 = () => {
  const getParentIndex = (index) => Math.floor((index - 1) / 2)
  const getLeftIndex = (index) => index * 2 + 1
  const getRightIndex = (index) => index * 2 + 2

  const swap = (arr, i, j) => {
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  const sink = (arr, index, size) => {
    while (1) {
      let swapIndex = index

      const left = getLeftIndex(index)
      if (left < size && arr[left] > arr[swapIndex]) {
        swapIndex = left
      }

      const right = getRightIndex(index)
      if (right < size && arr[right] > arr[swapIndex]) {
        swapIndex = right
      }

      if (swapIndex === index) {
        break
      }

      swap(arr, index, swapIndex)
      index = swapIndex
    }
  }

  const buildMaxHeap = (arr) => {
    const size = arr.length
    /** 最后一个非叶子结点即： 最后一个元素的父节点 */
    const lastParentIndex = getParentIndex(size - 1)

    for (let i = lastParentIndex; i >= 0; i--) {
      sink(arr, i, size)
    }
  }

  const heapSort = (arr) => {
    buildMaxHeap(arr)

    for (let right = arr.length - 1; right > 0; right--) {
      swap(arr, 0, right)
      sink(arr, 0, right)
    }

    return arr
  }

  return heapSort
}

export const heapSortV1 = createMaxHeapV1()
heapSortV1([0, 2, 1, 4, 6, 7, 8, 5]) // [0, 1, 2, 4, 5, 6, 7, 8]

const createMaxHeapV2 = () => {
  const getParentIndex = (index) => Math.floor((index - 1) / 2)
  const getLeftIndex = (index) => index * 2 + 1
  const getRightIndex = (index) => index * 2 + 2

  const swap = (arr, i, j) => {
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  const swim = (arr, index) => {
    while (index > 0) {
      let parentIndex = getParentIndex(index)
      if (parentIndex >= 0 && arr[index] > arr[parentIndex]) {
        swap(arr, index, parentIndex)
      }

      index = parentIndex
    }
  }

  const sink = (arr, index, size) => {
    while (1) {
      let swapIndex = index

      const left = getLeftIndex(index)
      if (left < size && arr[left] > arr[swapIndex]) {
        swapIndex = left
      }

      const right = getRightIndex(index)
      if (right < size && arr[right] > arr[swapIndex]) {
        swapIndex = right
      }

      if (swapIndex === index) {
        break
      }

      swap(arr, index, swapIndex)
      index = swapIndex
    }
  }

  const buildMaxHeap = (arr) => {
    const size = arr.length
    for (let i = 1; i < size; i++) {
      swim(arr, i)
    }
  }

  const heapSort = (arr) => {
    buildMaxHeap(arr)

    for (let right = arr.length - 1; right > 0; right--) {
      swap(arr, 0, right)
      sink(arr, 0, right)
    }

    return arr
  }

  return heapSort
}

export const heapSortV2 = createMaxHeapV2()
heapSortV2([0, 2, 1, 4, 6, 7, 8, 5]) // [0, 1, 2, 4, 5, 6, 7, 8]
