export const createSchedulerHostConfig = () => {
  /** 1 */
  const getCurrentTime = () => performance.now()

  let scheduledHostCallback = null
  let isMessageLoopRunning = false

  let yieldInterval = 5
  let deadline = 0

  let needsPaint = false

  const requestPaint = () => (needsPaint = true)

  /** */
  const shouldYieldToHost = () => {
    const currentTime = getCurrentTime()

    if (currentTime >= deadline) {
      if (needsPaint) return true

      return true
    } else {
      return false
    }
  }

  /** */
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

  /** 1 */
  const requestHostCallback = (callback) => {
    scheduledHostCallback = callback

    if (!isMessageLoopRunning) {
      isMessageLoopRunning = true
      port.postMessage(null)
    }
  }

  /** */
  const cancelHostCallback = () => {
    scheduledHostCallback = null
  }

  return {
    getCurrentTime,
    requestPaint,
    shouldYieldToHost,
    requestHostCallback,
    cancelHostCallback,
  }
}

export const createSchedulerMinHeap = (capacity) => {
  const push = (heap, node) => {}

  const peek = (heap) => {}

  const pop = (heap) => {}

  return { push, peek, pop }
}

const createScheduler = () => {
  const { getCurrentTime, requestPaint, shouldYieldToHost, requestHostCallback, cancelHostCallback } = createSchedulerHostConfig()
  const { push, peek, pop } = createSchedulerMinHeap()

  const NoPriority = 0
  const ImmediatePriority = 1
  const UserBlockingPriority = 2
  const NormalPriority = 3
  const LowPriority = 4
  const IdlePriority = 5

  const maxSigned31BitInt = 1073741823

  /** */
  const IMMEDIATE_PRIORITY_TIMEOUT = -1
  const USER_BLOCKING_PRIORITY_TIMEOUT = 250
  const NORMAL_PRIORITY_TIMEOUT = 5000
  const LOW_PRIORITY_TIMEOUT = 10000
  const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt

  /** */
  const taskQueue = []
  const timerQueue = []

  let taskIdCounter = 1

  let currentTask = null
  let currentPriorityLevel = NormalPriority

  /** */
  let isPerformingWork = false

  let isHostCallbackScheduled = false

  const flushWork = (hasTimeRemaining, initialTime) => {
    isHostCallbackScheduled = false
    isPerformingWork = true

    const previousPriorityLevel = currentPriorityLevel

    try {
      return workLoop(hasTimeRemaining, initialTime)
    } finally {
      currentTask = null
      currentPriorityLevel = previousPriorityLevel
      isPerformingWork = false
    }
  }

  const workLoop = (hasTimeRemaining, initialTime) => {
    let currentTime = initialTime

    currentTask = peek(taskQueue)

    while (currentTask !== null) {
      /** */
      if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
        break
      }

      const callback = currentTask.callback

      if (typeof callback === 'function') {
        currentTask.callback = null
        currentPriorityLevel = currentTask.priorityLevel

        const didUserCallbackTimeout = currentTask.expirationTime <= currentTime

        const continuationCallback = callback(didUserCallbackTimeout)
        currentTime = getCurrentTime()

        if (typeof continuationCallback === 'function') {
          currentTask.callback = continuationCallback
        } else {
          /**  */
          if (currentTask === peek(taskQueue)) {
            pop(taskQueue)
          }
        }
      } else {
        pop(taskQueue)
      }

      currentTask = peek(taskQueue)
    }

    if (currentTask !== null) {
      return true
    } else {
      // TODO: timer queue

      return false
    }
  }

  const scheduleCallback = (priorityLevel, callback, options) => {
    const currentTime = getCurrentTime()

    /**1 */
    let startTime
    if (typeof options === 'object' && options !== null) {
      // TODO: delay option
    } else {
      startTime = currentTime
    }

    /** */
    let timeout
    switch (priorityLevel) {
      case ImmediatePriority:
        timeout = IMMEDIATE_PRIORITY_TIMEOUT
        break
      case UserBlockingPriority:
        timeout = USER_BLOCKING_PRIORITY_TIMEOUT
        break
      case IdlePriority:
        timeout = IDLE_PRIORITY_TIMEOUT
        break
      case LowPriority:
        timeout = LOW_PRIORITY_TIMEOUT
        break
      case NormalPriority:
      default:
        timeout = NORMAL_PRIORITY_TIMEOUT
        break
    }

    /** */
    const expirationTime = startTime + timeout

    const newTask = {
      id: taskIdCounter++,
      callback,
      priorityLevel,
      startTime,
      expirationTime,
      sortIndex: -1,
    }

    if (startTime > currentTime) {
      // TODO: This is a delayed task.
    } else {
      newTask.sortIndex = expirationTime
      push(taskQueue, newTask)

      if (!isHostCallbackScheduled && !isPerformingWork) {
        isHostCallbackScheduled = true

        requestHostCallback(flushWork)
      }
    }

    return newTask
  }

  return {
    scheduleCallback,
  }
}
