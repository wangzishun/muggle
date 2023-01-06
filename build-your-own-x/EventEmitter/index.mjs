export class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [callback]
    } else {
      this.events[eventName].push(callback)
    }
  }

  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((func) => func !== callback && func.__once_chched_callback__ !== callback)
    }
  }

  once(eventName, callback) {
    const one = (...args) => {
      callback(...args)
      this.off(eventName, one)
    }

    one.__once_chched_callback__ = callback
    this.on(eventName, one)
  }

  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((func) => func(...args))
    }
  }
}
