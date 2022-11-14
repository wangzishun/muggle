let workInProgressHook = null
let isMount = true

const fiber = {
  memoizedState: null,
  stateNode: App
}

const schedule = () => {
  workInProgressHook = fiber.memoizedState
  const app = fiber.stateNode()

  isMount = false

  return app
}

const dispatchAction = (queue, action) => {
  const update = {
    action,
    order: 0,
    next: null
  }

  if (queue.pending === null) {
    update.next = update
  } else {
    update.next = queue.pending.next
    queue.pending.next = update
  }
  update.order = update.next.order + 1
  queue.pending = update

  schedule()
}

const useState = (initialState) => {
  let hook

  if (isMount) {
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next: null
    }

    if (!fiber.memoizedState) {
      fiber.memoizedState = hook
    } else {
      workInProgressHook.next = hook
    }

    workInProgressHook = hook
  } else {
    hook = workInProgressHook
    workInProgressHook = workInProgressHook.next
  }

  let baseState = hook.memoizedState
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next
    do {
      baseState = firstUpdate.action(baseState)
      firstUpdate = firstUpdate.next
    } while (firstUpdate !== hook.queue.pending)

    hook.queue.pending = null
  }

  hook.memoizedState = baseState

  return [baseState, dispatchAction.bind(null, hook.queue)]
}

function App() {
  const [clickTimes, setClickTimes] = useState(0)
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)

  console.log(`app ${isMount ? ' mount' : 'update'}; clickTimes: ${clickTimes}; count: ${count}; visible: ${visible}`)

  return {
    click() {
      setClickTimes((t) => t + 1)
      setCount((c) => c + 1)
      setCount((c) => c + 1)
      setCount((c) => c + 1)
      setVisible((v) => !v)
    }
  }
}

const app = schedule()
app.click()
app.click()
