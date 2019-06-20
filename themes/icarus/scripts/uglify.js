const CleanCSS = require("clean-css");
const UglifyJS = require("uglify-es");
const Htmlminifier = require("html-minifier").minify;
const minimatch = require("minimatch");

function logicHtml(str, data) {
  const hexo = this;
  const options = hexo.config.uglify_html;
  // Return if disabled.
  if (options.enable === false) return;

  let path = data.path;
  let exclude = options.exclude;
  if (exclude && !Array.isArray(exclude)) exclude = [exclude];

  if (path && exclude && exclude.length) {
    for (let i = 0, len = exclude.length; i < len; i++) {
      if (minimatch(path, exclude[i], { matchBase: true })) return str;
    }
  }

  let result = Htmlminifier(str, options);
  let saved = (((str.length - result.length) / str.length) * 100).toFixed(2);
  if (options.logger) {
    let log = hexo.log || console.log;
    log.log("Minify the html: %s [%s saved]", path, saved + "%");
  }
  return result;
}

function logicCss(str, data) {
  const hexo = this;
  const options = hexo.config.uglify_css;
  // Return if disabled.
  if (options.enable === false) return;

  let path = data.path;
  let exclude = options.exclude;
  if (exclude && !Array.isArray(exclude)) exclude = [exclude];

  if (path && exclude && exclude.length) {
    for (let i = 0, len = exclude.length; i < len; i++) {
      if (minimatch(path, exclude[i], { matchBase: true })) return str;
    }
  }

  return new Promise(function(resolve, reject) {
    new CleanCSS({ level: 2 }).minify(str, function(err, result) {
      if (err) return reject(err);
      let saved = (
        ((str.length - result.styles.length) / str.length) *
        100
      ).toFixed(2);
      resolve(result.styles);
      if (options.logger) {
        let log = hexo.log || console.log;
        log.log("Minify the css: %s [%s saved]", path, saved + "%");
      }
    });
  });
}

function logicJs(str, data) {
  const hexo = this;
  const options = hexo.config.uglify_js;
  // Return if disabled.
  if (options.enable === false) return;
  let path = data.path;
  let exclude = options.exclude;
  if (exclude && !Array.isArray(exclude)) exclude = [exclude];

  if (path && exclude && exclude.length) {
    for (let i = 0, len = exclude.length; i < len; i++) {
      if (minimatch(path, exclude[i], { matchBase: true })) return str;
    }
  }

  // uglifyjs doesn't like unsupported options
  delete options.enable;
  delete options.exclude;
  let jsLogger = options.logger;
  delete options.logger;

  let result = UglifyJS.minify(str, options);
  let saved = (((str.length - result.code.length) / str.length) * 100).toFixed(
    2
  );
  if (jsLogger) {
    let log = hexo.log || console.log;
    log.log("Minify the js: %s [%s saved]", path, saved + "%");
  }
  return result.code;
}
if (hexo.config.uglify_enable === true) {
  // HTML minifier
  hexo.config.uglify_html = Object.assign(
    {
      enable: true,
      logger: false,
      exclude: [],
      ignoreCustomComments: [/^\s*more/],
      removeComments: true,
      removeCommentsFromCDATA: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
      minifyCSS: true
    },
    hexo.config.uglify_html
  );

  // Css minifier
  hexo.config.uglify_css = Object.assign(
    {
      enable: true,
      logger: false,
      exclude: ["*.min.css"]
    },
    hexo.config.uglify_css
  );

  // Js minifier
  hexo.config.uglify_js = Object.assign(
    {
      enable: true,
      mangle: true,
      logger: false,
      output: {},
      compress: {},
      exclude: ["*.min.js"]
    },
    hexo.config.uglify_js
  );
  hexo.extend.filter.register("after_render:html", logicHtml);
  hexo.extend.filter.register("after_render:css", logicCss);
  hexo.extend.filter.register("after_render:js", logicJs);
}