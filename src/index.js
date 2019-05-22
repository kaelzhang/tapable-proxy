const {isObject} = require('core-util-is')
const {errorInvalidHookName, error} = require('./error')

const APPLY_TAPS = Symbol('apply')
const SET_HOOKS = Symbol('set-hook')

class FakeHook {
  constructor () {
    this._taps = Object.create(null)
  }

  [APPLY_TAPS] (realHook, clean) {
    for (const [type, taps] of Object.entries(this._taps)) {
      for (const {name, handler} of taps) {
        realHook[type](name, handler)
      }

      if (clean) {
        taps.length = 0
      }
    }
  }

  _tap (type, name, handler) {
    const tapType = this._taps[type] || (this._taps[type] = [])
    tapType.push({
      name,
      handler
    })
  }

  tap (name, handler) {
    this._tap('tap', name, handler)
  }

  tapPromise (name, handler) {
    this._tap('tapPromise', name, handler)
  }

  tapAsync (name, handler) {
    this._tap('tapAsync', name, handler)
  }
}

const checkRealHooks = hooks => {
  if (!isObject(hooks)) {
    throw error('INVALID_REAL_HOOKS', hooks)
  }
}

class Handler {
  constructor () {
    this._hooks = Object.create(null)
    this._apply = this._apply.bind(this)
    this._setHooks = this._setHooks.bind(this)
  }

  _apply (realHooks, clean = true) {
    checkRealHooks(realHooks)
    for (const [name, fakeHook] of Object.entries(this._hooks)) {
      if (!(name in realHooks)) {
        throw errorInvalidHookName(name, realHooks)
      }

      fakeHook[APPLY_TAPS](realHooks[name], clean)
    }
  }

  _setHooks (realHooks) {
    checkRealHooks(realHooks)
    this._hooks = realHooks
  }

  get (target, prop) {
    if (prop === APPLY_TAPS) {
      return this._apply
    }

    if (prop === SET_HOOKS) {
      return this._setHooks
    }

    const hook = this._hooks[prop]
    if (hook) {
      return hook
    }

    return this._hooks[prop] = new FakeHook()
  }
}

const create = () => {
  const handler = new Handler()
  return new Proxy({}, handler)
}

module.exports = {
  create,
  APPLY_TAPS,
  SET_HOOKS
}
