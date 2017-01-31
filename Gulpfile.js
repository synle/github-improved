//gulp libs
var gulp = require('gulp');
var _ = require('lodash');
var replace = require('gulp-replace');
var concat = require('gulp-concat');


//internal gulp tasks
var simpleGulpBuilder = require('simple-gulp-builder');

//config
//paths
var DEST_BASE = 'chrome';
var DEST_DIST = DEST_BASE + '/dist';
var VIEW_PAGE_CONFIG = [ ];
var STYLE_INJECTED_SRC = [ 'src/inject/style/app.scss' ];
var STYLE_INJECTED_DEST = 'app.css';
var JS_INJECTED_SRC  = [ 'src/inject/js/app.js' ];
var JS_BACKGROUND_SRC  = [ 'src/background/index.js' ];
var JS_NEWTAB_SRC  = [ 'src/newtab/index.js' ];
var JS_VENDOR_FILES = ['node_modules/zepto/dist/zepto.min.js'];
var CHROME_MANIFEST_BASE_SRC = './chrome/manifest.json.bak';
var CHROME_MANIFEST_BASE_DEST = './chrome';
//config for transformation
var ALIASIFY_COMMON_CONFIG = {
  "replacements": {
    "@src/(\\w+)": "./src/inject/js/$1"
  }
}
var ALIASIFY_PROD_CONFIG =  {
	"replacements": {
    "app_environment": "./src/env.prod.js"
  }
};

var ALIASIFY_DEV_CONFIG =  {
  "replacements": {
    "app_environment": "./src/env.dev.js"
  }
};

//merge alias config
[ALIASIFY_PROD_CONFIG, ALIASIFY_DEV_CONFIG].forEach(
  function(aliasify_config){
    aliasify_config = _.merge(
      aliasify_config,
      ALIASIFY_COMMON_CONFIG
    );
  }
);

var BABELIFY_CONFIG = {
  presets: [ "es2015", "react" ]
};


//styles
gulp.task('styles', simpleGulpBuilder.compileStyles( STYLE_INJECTED_SRC, DEST_DIST, STYLE_INJECTED_DEST ) );

//views
gulp.task('views',  simpleGulpBuilder.copyFile( VIEW_PAGE_CONFIG, DEST_DIST ));

//js
gulp.task('js-app-dev', simpleGulpBuilder.compileJs( JS_INJECTED_SRC, DEST_DIST, 'app.js', BABELIFY_CONFIG, ALIASIFY_DEV_CONFIG ));
gulp.task('js-app-prod', simpleGulpBuilder.compileJs( JS_INJECTED_SRC, DEST_DIST, 'app.js', BABELIFY_CONFIG, ALIASIFY_PROD_CONFIG ));
gulp.task('js-bg-dev', simpleGulpBuilder.compileJs( JS_BACKGROUND_SRC, DEST_DIST, 'background.js', BABELIFY_CONFIG, ALIASIFY_DEV_CONFIG ));
gulp.task('js-bg-prod', simpleGulpBuilder.compileJs( JS_BACKGROUND_SRC, DEST_DIST, 'background.js', BABELIFY_CONFIG, ALIASIFY_PROD_CONFIG ));
gulp.task('js-newtab-dev', simpleGulpBuilder.compileJs( JS_NEWTAB_SRC, DEST_DIST, 'newtab.js', BABELIFY_CONFIG, ALIASIFY_DEV_CONFIG ));
gulp.task('js-newtab-prod', simpleGulpBuilder.compileJs( JS_NEWTAB_SRC, DEST_DIST, 'newtab.js', BABELIFY_CONFIG, ALIASIFY_PROD_CONFIG ));
gulp.task('js-vendor', simpleGulpBuilder.concatFiles( JS_VENDOR_FILES, DEST_DIST, 'vendor.js' ));

//Watch task (mainly used for dev...)
gulp.task('watch', ['watch-style', 'watch-js-app', 'watch-js-newtab']);

gulp.task('watch-style',function() {
  return gulp.watch(
    ['src/inject/style/**/*'],
    ['styles']
  );
});


gulp.task('watch-js-app',function() {
  return gulp.watch(
    ['src/inject/js/**/*'],
    ['js-app-dev']
  );
});

gulp.task('watch-js-bg',function() {
  return gulp.watch(
    ['src/background/**/*'],
    ['js-bg-dev']
  );
});


gulp.task('watch-js-newtab',function() {
  return gulp.watch(
    ['src/newtab/**/*'],
    ['js-newtab-dev']
  );
});


gulp.task('chrome-manifest-prod', simpleGulpBuilder.replaceString(
  CHROME_MANIFEST_BASE_SRC,
  DEST_BASE,
  'manifest.json',
  ['APP_NAME', 'Github Improved']
));


gulp.task('chrome-manifest-dev', simpleGulpBuilder.replaceString(
  CHROME_MANIFEST_BASE_SRC,
  DEST_BASE,
  'manifest.json',
  ['APP_NAME', 'Github Improved Dev']
));





// apply-prod environment (mainly used to remove react development warning)
gulp.task('apply-prod-environment', function() {
  // this task is mainly used to remove react development warning
  process.env.NODE_ENV = 'production';
});

// build
gulp.task('build-dev', ['apply-prod-environment', 'chrome-manifest-dev','styles', 'views', 'js-app-dev', 'js-bg-dev', 'js-newtab-dev', 'js-vendor']);
gulp.task('build-prod', ['apply-prod-environment', 'chrome-manifest-prod', 'styles', 'views', 'js-app-prod', 'js-bg-prod', 'js-newtab-prod', 'js-vendor']);

gulp.task('default', ['build-dev', 'watch']);
