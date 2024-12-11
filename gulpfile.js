import Gulp from 'gulp';
const { src, dest, parallel, series, watch } = Gulp;
// import gulpPlumber from 'gulp-plumber';
import Scss from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(Scss);
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
import { deleteAsync } from 'del';
import browserSync from 'browser-sync';

// Минификация HTML

const html = () => {
  return src('src/*.html')
  .pipe(dest('build'));
}
export {html};

// Минификация CSS

const styles = () => {
  return src('src/scss/style.scss')
    // .pipe(gulpPlumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(rename('style.css'))
    .pipe(dest('build/css'))
    .pipe(browserSync.stream());
}
export {styles};

// Минификация JavaScript

const scripts = () => {
  return src('src/js/**/*.js')
    .pipe(dest('build/js'))
}
export {scripts};

// Оптимизация изображений

const optimizeImages = () => {
  return src('src/img/**/*.{png,svg,jpeg}')
    .pipe(dest('build/img'))
}
export {optimizeImages};

// Копирование не изменных файлов

const copy = (done) => {
  src([
    // 'source/fonts/*.{woff2,woff}',
    'src/*.ico',
  ], {
    base: 'src'
  })
    .pipe(dest('build'))
  done();
}
export {copy};

// Очистка /build перед сборкой

const clean = async () => {
  return await deleteAsync('build');
}
export {clean};

// Локальный сервер

const server = (done) => {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}
export {server};

// Перезагрузка страницы

const reload = (done) => {
  browserSync.reload();
  done();
}

// Отслеживание изменений

const watcher = () => {
  watch('src/scss/**/*.scss', series('styles'));
  watch('src/js/*.js', series(scripts, reload));
  watch('src/*.html', series(html, reload));
}

// Сборка билда - npm run build

export let build = series(
  clean,
  copy,
  optimizeImages,
  parallel(
    styles,
    html,
    scripts
  )
);

// Сборка dev-версии - npm start

export default series(
  clean,
  copy,
  optimizeImages,
  parallel(
    styles,
    html,
    scripts
  ),
  series(
    server,
    watcher
  )
);
