/**
 * @file auto-modules-css-loader
 * 
 * a wrapped css-loader providing one extra feature:
 * auto detect if should enable cssModules feature in css-loader
 * by inspecting the dependent
 * and see if it do `import 'some.css'` or `import style form 'some.css'`
 */

var cssLoader = require('css-loader')
var selfPath = __dirname + '/index.js'

function proxyLoader(...args) {
  var selfResource = this._module.issuer.resource
  var dependent = this._module.issuer.issuer

  /**
   * try find references to `import style from 'some.css'`
   * if side-effect only `import 'some.css'`,
   * `HarmonyImportSpecifierDependency` won't appear in dependencies
   */
  var cssModulesImportSpecifiers = dependent.dependencies.filter(dep => {
    if (!dep.module) return false
    if (dep.module.resource !== selfResource) return false

    var ctor = dep.__proto__.constructor
    if (ctor && ctor.name === 'HarmonyImportSpecifierDependency') {
      return true
    }
    return false
  })

  var shouldEnableCssModules = cssModulesImportSpecifiers.length > 0

  var selfLoaderObj = this.loaders.find(loader => loader.path === selfPath)
  var optModules = selfLoaderObj.options && selfLoaderObj.options.modules
  if (shouldEnableCssModules) {
    optModules = optModules ? optModules : true
  } else {
    optModules = false
  }

  selfLoaderObj.options = { ...selfLoaderObj.options, modules: optModules }

  return cssLoader.apply(this, args)
}

module.exports = proxyLoader
