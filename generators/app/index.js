var Generator = require('yeoman-generator');

module.exports = Generator.extend({
	constructor: function () {
		Generator.apply(this, arguments);

		this.option('skip-install');

	},

	prompting: {
		dir: function () {
			if (this.options.createDirectory !== undefined) {
				return true;
			}

			var prompt = [{
				type: 'confirm',
				name: 'createDirectory',
				message: '¿Quieres crear un nuevo directorio para tu proyecto?'
			}];

			return this.prompt(prompt).then(function (response){
				this.options.createDirectory = response.createDirectory;
			}.bind(this));
		},
		dirname: function () {
			if(!this.options.createDirectory || this.options.dirname) {
				return true;
			}

			var prompt = [{
				type: 'input',
				name: 'dirname',
				message: 'Escribe el nombre de el directorio'
			}];

			return this.prompt(prompt).then(function (response) {
				this.options.dirname = response.dirname;
			}.bind(this));
		}
	},
	writing: {
		buildEnv: function () {
			if(this.options.createDirectory) {
				this.destinationRoot(this.options.dirname);
				this.appname = this.options.dirname;
			}
		}
	}
});