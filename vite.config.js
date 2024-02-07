import { resolve } from 'node:path';
import { defineConfig } from 'vite';
// import imagemin from 'unplugin-imagemin/vite';
import squooshPlugin from 'vite-plugin-squoosh';
import autoprefixer from 'autoprefixer';
import browserslist from 'browserslist';
import handlebars from 'vite-plugin-handlebars';
import zipPack from "vite-plugin-zip-pack";
import HandlebarUpdate from "./src/js/handlebarUpdate";


const pageData = {
  "/index.html": {
    isHome: true,
  },
  "/src/pages/about-detail.html": {
    isHome: false,
  },
  "/src/pages/contacts-detail.html": {
    isHome: false,
  },
  "/src/pages/news-detail.html": {
    isHome: false,
  },
  "/src/pages/news.html": {
    isHome: false,
  },
  "/src/pages/vacancy.html": {
    isHome: false,
  },
  "/src/pages/detail.html": {
  isHome: false,
  },
};

// @see https://github.com/vitejs/vite/issues/5815
global.navigator = undefined

export default defineConfig({
  
  resolve: {
    alias: {
      '@' : resolve(__dirname, 'src'),
    },
  },
  server: {
    hmr: true,
    open: true,
    host: true,
    port: 8888,
  },
    base: '/bolshoy/',
  // root: "src",
  // publicDir: "public",
  build: {
    // outDir: "dist",
    emptyOutDir: true,
    cssCodeSplit: false,
    minify: false,
    rollupOptions: {
        input : {
          index: resolve(__dirname, "index.html"),
          aboutdetail: resolve(__dirname, "src", "pages", "about-detail.html"),
          contactsdetail: resolve(__dirname, "src", "pages", "contacts-detail.html"),
          newsdetail: resolve(__dirname, "src", "pages", "news-detail.html"),
          news: resolve(__dirname, "src", "pages", "news.html"),
          vacancy: resolve(__dirname, "src", "pages", "vacancy.html"),
          detail: resolve(__dirname, "src", "pages", "detail.html"),
        }
    }
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(
          {
            overrideBrowserslist: browserslist(),
          }
        )
        // Другие плагины postcss
      ],
    },
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules']
      }
    }
  },
  // input: {
  //   index: resolve(__dirname, "index.html"),
  // },
  plugins: [
    HandlebarUpdate(),
    squooshPlugin({
      // Specify codec options.
      codecs: {
          // mozjpeg: { quality: 30, smoothing: 1 },
          // webp: { quality: 25 },
          // avif: { cqLevel: 20, sharpness: 1 },
          // jxl: { quality: 30 },
          // wp2: { quality: 40 },
          // oxipng: { level: 3 }
          jpg: {
            quality: 99,
          },
          gif: {
            quality: 99,
          },
      },
      // Do not encode .wp2 and .webp files.
      exclude: /.(wp2|webp)$/,
      // Encode png to webp.
      // encodeTo: [{ from: /.png$/, to: "webp" }]
      encodeTo: [
        { from: /.png$/, to: 'webp' },
        { from: /.jpeg$/, to: 'webp' },
        { from: /.jpg$/, to: 'webp' },
        { from: /.gif$/, to: 'webp' },
      ],
  }),
    // imagemin({
    //   mode: 'sharp',
    //   compress: {
    //     jpg: {
    //       quality: 70,
    //     },
    //     jpeg: {
    //       quality: 70,
    //     },
    //     png: {
    //       quality: 70,
    //     },
    //     webp: {
    //       quality: 70,
    //     },
    //     gif: {
    //       quality: 90,
    //     }
    //   },
    //   conversion: [
    //     { from: 'png', to: 'webp' },
    //     { from: 'jpeg', to: 'webp' },
    //     { from: 'jpg', to: 'webp' },
    //   ]
    // }),
    handlebars({
      partialDirectory: resolve(__dirname, "src", "partials"),
      context(pagePath) {
        return pageData[pagePath];
      },
      reloadOnPartialChange: true,
    }),
    zipPack({
      outFileName: `choma__project.zip`
    }),
  ],
})