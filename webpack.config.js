const path = require('path');

module.exports = {
	entry:{
		main: './client/main.js'
	},
	output: {
		path: path.join(process.cwd(),'assets','scripts'),
		filename: '[name].js',
		chunkFilename: '[id].[name].chunk.js'
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 1000
	}
}
