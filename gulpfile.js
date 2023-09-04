const{src, dest, watch,parallel, series}=require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat=require('gulp-concat');
const browserSync= require('browser-sync').create();
const autoprefixer= require('gulp-autoprefixer');
const include = require('gulp-include');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify-es').default;


function scripts(){
    return src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())

}

function styles(){
    return src('app/scss/style.scss')
    .pipe(autoprefixer({overrideBrowserlist:['last 10 version']}))    
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle:'compressed'}))
    .pipe(dest('app/css')) 
    .pipe(browserSync.stream())
}

function pages(){
    return src('app/pages/*.html')
    .pipe(include({
        includePaths: 'app/components'
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream())
}

function watching(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });                          
    watch(['app/scss/*.scss'], styles)
    watch(['app/components/*', 'app/pages/*'], pages)
    watch(['app/js/main.js'], scripts)  
    watch(['app/*.html']).on('change', browserSync.reload)
}

function cleanDist(){
    return src('dist')
    .pipe(clean())
}

function building(){
    return src ([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/*html',
        'app/img/*.svg'
    ],
    {base:'app'})
   .pipe(dest('dist'))
}


exports.styles = styles;
exports.scripts=scripts;
exports.pages=pages;
exports.watching = watching;
exports.building=building;
exports.build=series(cleanDist, building);
exports.default=parallel(styles, scripts,pages,watching);