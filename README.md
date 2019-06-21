# auto-modules-css-loader

This loader is just a wrapper around [`css-loader`](https://github.com/webpack-contrib/css-loader). It provides only one extra feature: auto detects if CSS Modules is used from your source code and toggles the `modules` option for you.

**IMPORTANT!** `auto-modules-css-loader` only handles the `modules` option, all other options are naively passed down to `css-loader`. Please consult [their docs](https://github.com/webpack-contrib/css-loader) for configuration details.

## Usage

`css-loader` is specified as a peer dependency. You'll need to install it first.

Then simple replace `css-loader` with `auto-modules-css-loader` and you're good to go.

```diff
var webpackConfig.module.rules = [
  {
    test: /\.css$/,
    use: [{
-     loader: 'css-loader',
+     loader: 'auto-modules-css-loader',
      options: { /* ... */ }
    }]
  }
]
```

Now in your source code, both side-effect imported stylesheet and CSS Module stylesheet would work as expected.

```jsx
import './my-plain-stylesheet.css'
import style from './my-css-module-stylesheet.css'

// Note that you still need to manually add the `camcelCase` option
// if you prefer to use camel case locals.
// `auto-modules-css-loader` doesn't config that for you.
function App() {
  return <div className={style.myClassName} >hello</div>
}
```
