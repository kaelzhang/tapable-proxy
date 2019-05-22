[![Build Status](https://travis-ci.org/kaelzhang/tapable-proxy.svg?branch=master)](https://travis-ci.org/kaelzhang/tapable-proxy)
[![Coverage](https://codecov.io/gh/kaelzhang/tapable-proxy/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/tapable-proxy)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/tapable-proxy?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/tapable-proxy)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/tapable-proxy.svg)](http://badge.fury.io/js/tapable-proxy)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/tapable-proxy.svg)](https://www.npmjs.org/package/tapable-proxy)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/tapable-proxy.svg)](https://david-dm.org/kaelzhang/tapable-proxy)
-->

# tapable-proxy

The pseudo tapable based on [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). `tapable-proxy` could create fake hooks which can be tapped even before the creation of real hooks.

## Install

```sh
$ npm i tapable-proxy
```

## Usage

```js
const {
  create,
  APPLY
} = require('tapable-proxy')
const hooks = create()

hooks.afterEmit.tap('MyPlugin', compilation => {
  // ...
})

// Apply to webpack compiler hooks
hooks[APPLY](compiler.hooks)
```

## License

[MIT](LICENSE)
