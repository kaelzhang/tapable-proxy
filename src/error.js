const {Errors, exitOnNotDefined} = require('err-object')

const {error, E} = new Errors({
  prefix: '[tapable-proxy] ',
  notDefined: exitOnNotDefined
})

E('INVALID_HOOK_NAME', '"%s" is not a valid hook name. Available hook names are:\n%s')

const errorInvalidHookName = (name, hooks) => {
  const list = Object.keys(hooks).map(n => `  - ${n}`).join('\n')
  return error('INVALID_HOOK_NAME', name, list)
}

module.exports = {
  error,
  errorInvalidHookName
}
