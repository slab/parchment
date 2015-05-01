var gulp = require('gulp');
var ts = require('gulp-typescript');


gulp.task('default', ['build']);

gulp.task('build', function() {
  var compiler = ts({ delcarationFiles: false, module: 'commonjs' });
  var result = gulp.src('src/tree-list.ts')
                   .pipe(compiler);
  result.js.pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch('**/*.ts', ['build'])
});

