const {errorInvalidHookName} = require('./error')

const APPLY = Symbol('apply')
const SET_HOOKS = Symbol('set-hook')

class FakeHook {
  constructor () {
    this._taps = Object.create(null)
  }

  [APPLY] (realHook) {
    for (const [type, taps] of this._taps) {
      for (const {name, handler} of taps) {
        realHook[type](name, handler)
      }

      taps.length = 0
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

class Handler {
  constructor () {
    this._hooks = Object.create(null)
    this._apply = this._apply.bind(this)
    this._setHook = this._setHook.bind(this)
  }

  _apply (realHooks) {
    for (const [name, fakeHook] of Object.entries(this._hooks)) {
      if (!(name in realHooks)) {
        throw errorInvalidHookName(name, realHooks)
      }

      fakeHook[APPLY](realHooks[name])
    }
  }

  _setHooks (hooks) {
    this._hooks = hooks
  }

  get (target, prop) {
    if (prop === APPLY) {
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
  APPLY,
  SET_HOOKS
}
