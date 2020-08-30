var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  npmInit() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { title: 'p-test' }
    );
  }
  gitInit() {
    this.spawnCommandSync('git', ['init']);

    this.fs.copyTpl(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copyTpl(
      this.templatePath('pre-commit'),
      this.destinationPath('.git/hooks/pre-commit')
    );
  }
  installDependencies() {
    this.npmInstall([
      "@babel/core",
      "@babel/plugin-transform-react-jsx",
      "@babel/preset-env",
      "babel-loader",
      "css",
      "eslint",
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
      this.templatePath('nycrc'),
      this.destinationPath('.nycrc')
    );
    this.fs.copyTpl(
      this.templatePath('publish.js'),
      this.destinationPath('publish.js')
    );
    this.fs.copyTpl(
      this.templatePath('eslintrc'),
      this.destinationPath('.eslintrc')
    );
  }
};