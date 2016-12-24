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
var ALIASIFY_PROD_CONFIG =  {
	"replacements": {
      "@src/(\\w+)": "./src/inject/js/$1",
      "app_environment": "./src/env.prod.js"
    }
};

var ALIASIFY_DEV_CONFIG =  {
    "replacements": {
      "@src/(\\w+)": "./src/inject/js/$1",
      "app_environment": "./src/env.dev.js"
    }
};

var BABELIFY_CONFIG = { presets: [ "es2015", "react" ] };


//styles
gulp.task('styles', simpleGulpBuilder.compileStyles( STYLES_CONFIG, DEST_PATH, BUNDLED_STYLE_NAME ) );

//views
gulp.task('views',  simpleGulpBuilder.copyFile( VIEWS_PAGE_CONFIG, DEST_PATH ));

//js
gulp.task('js-dev', simpleGulpBuilder.compileJs( JS_CONFIG, DEST_PATH, BUNDLED_JS_NAME, BABELIFY_CONFIG, ALIASIFY_DEV_CONFIG ));
gulp.task('js-prod', simpleGulpBuilder.compileJs( JS_CONFIG, DEST_PATH, BUNDLED_JS_NAME, BABELIFY_CONFIG, ALIASIFY_PROD_CONFIG ));
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
        , ['js-dev']
    );
});



gulp.task('apply-prod-environment', function() {
    // this task is mainly used to remove react development wrar
    process.env.NODE_ENV = 'production';
});



// build
gulp.task('build-dev', ['apply-prod-environment', 'styles', 'views', 'js-dev', 'js:vendor']);
gulp.task('build-prod', ['apply-prod-environment', 'styles', 'views', 'js-prod', 'js:vendor']);

gulp.task('default', ['build-dev', 'watch']);
