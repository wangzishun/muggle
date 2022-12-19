export const getCurrentTime = () => performance.now()

let scheduledHostCallback = null
let isMessageLoopRunning = false

let yieldInterval = 5
let deadline = 0

let needsPaint = false

export const requestPaint = () => (needsPaint = true)

export const shouldYieldToHost = () => {
  const currentTime = getCurrentTime()

  if (currentTime >= deadline) {
    if (needsPaint) return true

    return true
  } else {
    return false
  }
}

const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime()
    deadline = currentTime + yieldInterval

    const hasTimeRemaining = true
    try {
      const hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime)
      if (!hasMoreWork) {
        isMessageLoopRunning = false
        scheduledHostCallback = null
      } else {
        port.postMessage(null)
      }
    } catch (error) {
      port.postMessage(null)
      throw error
    }
  } else {
    isMessageLoopRunning = false
  }

  needsPaint = false
}

const channel = new MessageChannel()
const port = channel.port2
channel.port1.onmessage = performWorkUntilDeadline

export const requestHostCallback = (callback) => {
  scheduledHostCallback = callback

  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true
    port.postMessage(null)
  }
}

export const cancelHostCallback = () => {
  scheduledHostCallback = null
}
