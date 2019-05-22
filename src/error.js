const {Errors, exitOnNotDefined} = require('err-object')

const {error, E} = new Errors({
  prefix: '[tapable-proxy] ',
  notDefined: exitOnNotDefined
})

E('INVALID_HOOK_NAME', '"%s" is not a valid hook name. Available hook names are:\n%s')

E('INVALID_REAL_HOOKS', 'real hooks must be an object, but got `%s`')

const NO_AVAILABLE_HOOK_NAMES = '  [no available hook names]'
const errorInvalidHookName = (name, hooks) => {
  const list = Object.keys(hooks)
  .map(n => `  - ${n}`)
  .join('\n')
  || NO_AVAILABLE_HOOK_NAMES

  return error('INVALID_HOOK_NAME', name, list)
}

module.exports = {
  error,
  errorInvalidHookName
}
