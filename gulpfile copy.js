const gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    sourcemaps = require('gulp-sourcemaps'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminPngquant = require('imagemin-pngquant'),
    babel = require('gulp-babel'),
    del = require('del'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var config = {
    server: {
        baseDir: "./"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000
};

const plugin_src = {
    js: [
        'src/js/*.js',
        '!src/js/*.min.js',
    ],
    css: [
        '!src/css/vendor',
        'src/less/**/*.less',
    ],
    cssMaps: [
        'src/css/maps/*',
    ],
    svg: [
        'src/images/**/*.svg',
    ],
    images: [
        'src/images/**/*.png',
        'src/images/**/*.jpeg',
        'src/images/**/*.jpg',
    ],
}

gulp.task('js', function () {
    return gulp.src(plugin_src.js)
        .pipe(babel())
        // .pipe(plugins.plumber())
        .pipe(plugins.uglify({
            compress: true,
            preserveComments: 'all',
        }))
        .pipe(plugins.rename({
            extname: '.js',
            suffix: '.min',
        }))
        .pipe(gulp.dest(function (file) {
            return file.base
        }))
        .pipe(reload({stream: true}))
        .pipe(plugins.notify({message: 'Скрипты собрались'}))
})

gulp.task('css', function () {
    return gulp.src(plugin_src.css)
        .pipe(sourcemaps.init())
        .pipe(plugins.plumber())
        .pipe(plugins.less())
        // .pipe(plugins.autoprefixer(['ios_saf >= 6', 'last 3 versions']))
        .pipe(plugins.csso())
        .pipe(plugins.concat('style.css'))
        .pipe(plugins.csso())
        .pipe(sourcemaps.write('/maps'))
        .pipe(gulp.dest('src/css/'))
        .pipe(reload({stream: true}))
        .pipe(plugins.notify({message: 'Стили собрались'}))
})

gulp.task('svg', function () {

    gulp.src(plugin_src.svg)
        .pipe(plugins.svgo())
        .pipe(gulp.dest(function (file) {
            return file.base
        }))
        .pipe(plugins.notify({message: 'SVG оптимизированы'}))
})

gulp.task('images', function () {
    return gulp.src(plugin_src.images)
        .pipe(plugins.plumber())
        .pipe(plugins.imagemin([
            plugins.imagemin.gifsicle({interlaced: true}),
            imageminJpegRecompress({
                progressive: true,
                max: 90,
                min: 70,
            }),
            imageminPngquant({
                quality: [0.8, 1],
                speed: 4,
                dithering: 1,
            }),
            plugins.imagemin.svgo({plugins: [{removeViewBox: true}]}),
        ]))
        .pipe(gulp.dest(function (file) {
            return file.base
        }))
        .pipe(reload({stream: true}))
        .pipe(plugins.notify({message: 'Картинка оптимизирована'}))

})

gulp.task('clean', function (cb) {
    del(plugin_src.cssMaps, cb)
})

gulp.task('watch', function () {

    gulp.watch(
        plugin_src.js,
        function (event) {
            plugin_src.js = [event.path]
            gulp.start('js')
        },
    )
    gulp.watch([plugin_src.css], ['css'])

})

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('default', ['clean', 'css', 'js', 'webserver', 'watch'])
