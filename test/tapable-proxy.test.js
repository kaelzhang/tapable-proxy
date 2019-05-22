const test = require('ava')
const delay = require('delay')
const {
  SyncHook,
  AsyncParallelHook
} = require('tapable')
const log = require('util').debuglog('tapable-proxy')
const {
  APPLY_TAPS,
  SET_HOOKS,
  create
} = require('..')

test('normal', async t => {
  const fake = create()

  // 1
  fake.afterEmit.tap('FOO', compilation => {
    compilation.assets.foo = 'bar'
  })

  const assets = {
    count: 0
  }

  const hooks = {
    afterEmit: new SyncHook(['compilation']),
    afterEmit2: new AsyncParallelHook(['compilation']),
    afterEmit3: new AsyncParallelHook(['compilation']),
    afterEmit4: new SyncHook(['compilation']),
    afterEmit5: new SyncHook(['compilation'])
  }

  fake[APPLY_TAPS](hooks)

  hooks.afterEmit.call({
    assets
  })

  t.is(assets.foo, 'bar')

  // 2
  fake.afterEmit2.tapPromise('FOO', c => {
    c.assets.bar = 'baz'
    return delay(10)
  })

  fake[APPLY_TAPS](hooks)
  await hooks.afterEmit2.promise({assets})
  t.is(assets.bar, 'baz')

  // 3
  fake.afterEmit3.tapAsync('FOO', (c, callback) => {
    c.assets.baz = 'quux'
    return delay(10).then(callback)
  })

  fake[APPLY_TAPS](hooks)
  await hooks.afterEmit3.promise({assets})
  t.is(assets.baz, 'quux')

  // 4
  const tapCount = () => {
    fake.afterEmit4.tap('FOO', compilation => {
      compilation.assets.count += 1
    })
  }

  tapCount()
  fake[APPLY_TAPS](hooks)
  fake[APPLY_TAPS](hooks)
  hooks.afterEmit4.call({assets})
  t.is(assets.count, 1)

  tapCount()
  fake[APPLY_TAPS](hooks, false)
  fake[APPLY_TAPS](hooks, false)
  hooks.afterEmit4.call({assets})
  t.is(assets.count, 4)

  // 5
  fake[SET_HOOKS](hooks)

  fake.afterEmit5.tap('FOO', compilation => {
    compilation.assets.foo = 'bar5'
  })

  hooks.afterEmit5.call({
    assets
  })

  t.is(assets.foo, 'bar5')

  t.throws(() => fake[SET_HOOKS](null), {
    code: 'INVALID_REAL_HOOKS'
  })
})

test('invalid hook name', t => {
  const fake = create()

  fake.afterEmit.tap('FOO', () => {})

  const shouldThrow = h => {
    try {
      fake[APPLY_TAPS](h)
    } catch (err) {
      log(err.stack)

      t.is(err.code, 'INVALID_HOOK_NAME')
      return
    }

    t.fail('should fail')
  }

  shouldThrow({
    foo: new SyncHook(),
    bar: new SyncHook(),
    baz: new SyncHook()
  })

  shouldThrow({})
})
