var gulp = require('gulp');
var to5 = require('gulp-6to5');
var react = require('gulp-react');

gulp.task('default', function() {
  gulp.src(['app.js', 'src/main.js'])
});
