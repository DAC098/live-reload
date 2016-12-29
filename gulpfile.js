const gulp = require('gulp');

const webpack = require('webpack');

gulp.task('default',() => {
	console.log('----------------------------------------------------------------------');
	webpack(require('./webpack.config.js'),(err,stats) => {
		if(err) console.log('ERROR:',err.message);
		else console.log('RESULTS:',stats.toString({
			assets: true,
			assetsSort: 'field',
			cached: false,
			children: false,
			chunks: false,
			colors: true
		}));
	});
});
