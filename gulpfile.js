// gulpfile.js
// Load plugins
var gulp = require('gulp')
  , rename = require('gulp-rename')
  , gutil = require('gulp-util')
  , plumber = require('gulp-plumber')
  , velocity = require('gulp-velocity')
  , connect = require('gulp-connect-multi')()
  , less = require('gulp-less')
  , sass = require('gulp-sass')
  , LessAutoprefix = require('less-plugin-autoprefix')
  , autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

var config = {
	'tpl_config':{
		"root":"./src/tpl/",// tpl根目录 
		"encoding":"utf-8",
		"macro":"./src/tpl/global-macro/macro.vm",//global macro defined file
		"globalMacroPath":"./src/tpl/global-macro",
		"dataPath":"./data/" // 测试数据根目录
	},
	'tmp_output':'./src/html/'
};


//connect
gulp.task('connect', connect.server({
	root:['./src/'],
	port:8080,
	lviereload:true
}));

gulp.task('less', function () { 
  gulp.src('./src/less/*.less')
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('./src/css'))
	  .pipe(connect.reload()); 
});

gulp.task('sass', function () { 
  gulp.src('./src/sass/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./src/css'))
      .pipe(connect.reload()); 
});

gulp.task('style', function () { 
  gulp.src('./src/css/*.css')
      .pipe(connect.reload()); 
  gulp.src('./src/html/*.html')
      .pipe(connect.reload());  
});

gulp.task('javascript', function () { 
  gulp.src('./src/js/')
      .pipe(connect.reload());   
});

// tpl
gulp.task('tpl', function() {
	gulp.src(config.tpl_config.root + '**/*.vm')
	.pipe(plumber())
	.pipe(
		velocity(config.tpl_config)
		.on('error', gutil.log)
	)
	.pipe(rename({
		extname:".html"
	}))
	.pipe(gulp.dest(config.tmp_output));
});

// html
gulp.task('html', function() {
	gulp.src(config.tmp_output + '/*.html')
		.pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['./src/sass/*.scss'], ['sass']);
    gulp.watch(['./src/less/*.less'], ['less']);
    gulp.watch(['./src/css/*.css'], ['style']);
	gulp.watch([config.tpl_config.root + '**/*.vm'], ['tpl']);
	gulp.watch([config.tmp_output + '/*.html'], ['html']);
    gulp.watch(['./src/js/app/*.js'], ['javascript']);
});

//gulp.task('default', ['tpl']);
gulp.task('default', ['connect','watch']);
