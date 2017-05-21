var Generator = require('yeoman-generator')
var yosay = require('yosay')
var chalk = require('chalk')

module.exports = Generator.extend({
  constructor: function () {
    Generator.apply(this, arguments)

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    })

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    })
  },
  initializing: function () {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('Welcome to BasicJS Generator'))
    }
  },
  prompting: {
    dir: function () {
      if (this.options.createDirectory !== undefined) {
        return true
      }

      let prompt = [{
        type: 'confirm',
        name: 'createDirectory',
        message: 'Would you like to create a new directory for your project?'
      }]

      return this.prompt(prompt).then(function (answer) {
        this.options.createDirectory = answer.createDirectory
      }.bind(this))
    },
    dirname: function () {
      if (!this.options.createDirectory || this.options.dirname) {
        return true
      }

      var prompt = [{
        type: 'input',
        name: 'dirname',
        message: 'Enter directory name'
      }]

      return this.prompt(prompt).then(function (answer) {
        this.options.dirname = answer.dirname
      }.bind(this))
    },
    authorInfo: function () {
      if (this.authorInfo !== undefined) {
        return true
      }

      var prompts = [{
        type: 'input',
        name: 'author',
        message: 'Please write the author name of this application',
        default: 'unknown'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Please write the application description',
        default: 'A JavaScript Single Page Application'
      },
      {
        type: 'input',
        name: 'license',
        message: 'Please write the license type',
        default: 'ISC'
      },
      {
        type: 'input',
        name: 'license',
        message: 'Finally, please type the application version',
        default: '0.1.0'
      }]

      return this.prompt(prompts).then(function (answers) {
        this.authorInfo = answers
      }.bind(this))
    }
  },
  writing: {

    createDirectory: function () {
      if (this.options.createDirectory) {
        this.destinationRoot(this.options.dirname)
        this.appname = this.options.dirname
      }
    },

    packageJSON: function () {
      if (this.options.createDirectory) {
        this.appname = this.options.dirname
      } else {
        this.appname = this.determineAppname()
      }

      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          appname: this.appname,
          description: this.authorInfo.description,
          version: this.authorInfo.version,
          author: this.authorInfo.author,
          license: this.authorInfo.license
        }
      )
    },

    install: function () {
      if (!this.options['skip-install']) {
        let dependencies = [
          'page',
          'yo-yo',
          'axios'
        ]

        let devDependencies = [
          'gulp',
          'gulp-if',
          'gulp-stylus',
          'gulp-webserver',
          'gulp-rename',
          'gulp-pug',
          'nib',
          'pugify',
          'babelify',
          'stringify',
          'watchify'
        ]

        this.npmInstall(dependencies, { 'save': true }, function () {
          if (!this.options['skip-install-message']) {
            this.log(chalk.green.bold('The application dependencies are ready!'))
          }
        }.bind(this))

        this.npmInstall(devDependencies, { 'save-dev': true }, function () {
          if (!this.options['skip-install-message']) {
            this.log(chalk.green.bold('The develop dependencies are ready!'))
          }
        }.bind(this))
      }
    }
  }
})
