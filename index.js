const fs = require('fs');
const path = require('path');
const compiler = require('vue-template-compiler');
const cabinet = require('filing-cabinet');

module.exports = function(partial, filename, directory, config, webpackConfig, configPath, ast, type) {
  const fileContent = fs.readFileSync(filename);
  const { script, styles } = compiler.parseComponent(fileContent.toString(), { pad: 'line' });
  if (type === 'script') {
    const scriptExt = script.lang || 'js';
    const scriptResult = cabinet({
      partial: partial,
      filename: `${path.basename(filename)}.${scriptExt}`,
      directory: directory,
      content: script.content
    });
    return scriptResult;
  }
  const stylesResult = styles.map(style => {
      const styleExt = (style.lang === 'css' || !style.lang) ? 'scss' : style.lang;
  return cabinet({
    partial: partial,
    filename: `${path.basename(filename)}.${styleExt}`,
    directory: directory,
    content: style.content
  })
});
  return stylesResult[0];
};