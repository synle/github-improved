//gulp libs
var gulp = require('gulp');

//internal gulp tasks
var simpleGulpBuilder = require('simple-gulp-builder');

//config
//paths
var DEST_PATH = 'chrome/dist';
var STYLES_CONFIG = [ 'src/inject/style/app.scss' ];
var BUNDLED_STYLE_NAME = 'app.css';
var VIEWS_PAGE_CONFIG = [ ];
var JS_CONFIG  = [ 'src/inject/js/app.js' ];
var BUNDLED_JS_NAME = 'app.js';
var JS_VENDOR_FILES = ['node_modules/zepto/dist/zepto.min.js'];
//config for transformation
var ALIASIFY_CONFIG =  {
	"replacements": {
      "@src/(\\w+)": "./src/inject/js/$1"
    }
};
var BABELIFY_CONFIG = { presets: [ "es2015", "react" ] };


//styles
gulp.task('styles', simpleGulpBuilder.compileStyles( STYLES_CONFIG, DEST_PATH, BUNDLED_STYLE_NAME ) );

//views
gulp.task('views',  simpleGulpBuilder.copyFile( VIEWS_PAGE_CONFIG, DEST_PATH ));

//js
gulp.task('js', simpleGulpBuilder.compileJs( JS_CONFIG, DEST_PATH, BUNDLED_JS_NAME, BABELIFY_CONFIG, ALIASIFY_CONFIG ));
gulp.task('js:vendor', simpleGulpBuilder.concatFiles( JS_VENDOR_FILES, DEST_PATH, 'vendor.js' ));

//Watch task
gulp.task('watch', ['watch:style', 'watch:js']);


gulp.task('watch:style',function() {
    return gulp.watch(
        ['src/inject/style/**/*']
        , ['styles']
    );
});


gulp.task('watch:js',function() {
    return gulp.watch(
        ['src/inject/js/**/*']
        , ['js']
    );
});

gulp.task('build', ['styles', 'views', 'js', 'js:vendor']);

gulp.task('default', ['build', 'watch']);