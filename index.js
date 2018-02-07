const fs = require('fs');
const path = require('path');
const compiler = require('vue-template-compiler');

module.exports = function(partial, filename, directory, config, webpackConfig, configPath, ast, isScript) {
  const cabinet = require('filing-cabinet');

  const fileContent = fs.readFileSync(filename);
  const { script, styles } = compiler.parseComponent(fileContent.toString(), { pad: 'line' });
  if (isScript) {
    const scriptExt = script.lang || '.js';
    return cabinet({
      partial: partial,
      filename: `${path.basename(filename)}.${scriptExt}`,
      directory: path.dirname(filename),
      content: script.content
    });
  }
  const stylesResult = styles.map(style => {
    const styleExt = (style.lang === 'css' || !style.lang) ? 'scss' : style.lang;
    return cabinet({
      partial: partial,
      filename: `${path.basename(filename)}.${styleExt}`,
      directory: path.dirname(filename),
      content: style.content
    })
  });
  return stylesResult[0];
};
