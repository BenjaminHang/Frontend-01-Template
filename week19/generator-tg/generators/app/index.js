var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  npmInit() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { title: 'p-test' }
    );
  }
  installDependencies() {
    this.npmInstall([
      "@babel/core",
      "@babel/plugin-transform-react-jsx",
      "@babel/preset-env",
      "babel-loader",
      "css",
      "esm",
      'html-webpack-plugin',
      "mocha",
      "nyc",
      "webpack",
      "webpack-cli",
      "webpack-dev-server"
    ], { 'save-dev': true });
  }
  writing() {
    this.fs.copyTpl(
      this.templatePath('Component.js'),
      this.destinationPath('lib/Component.js')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('index.html'),
      { title: 'Templating with Yeoman' }
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js')
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
    this.fs.copyTpl(
      this.templatePath('test.example.js'),
      this.destinationPath('src/test.example.js')
    );
    this.fs.copyTpl(
      this.templatePath('example.spec.js'),
      this.destinationPath('test/example.spec.js')
    );
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc')
    );
  }
};