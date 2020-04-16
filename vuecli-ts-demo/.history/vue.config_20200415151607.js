const path = require('path')
const resolve = dir => path.resolve(__dirname, dir)

// 去除多余CSS插件
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin')

// 添加打包分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

// 开启 gzip 压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i

// 是否是生产环境
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: "./", // 默认'/'，部署应用包时的基本 URL
  outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: './static',  // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: false,  // 生产环境的 source map
  parallel: require('os').cpus().length > 1,
  pwa: {},
  pages: {
    index: {
      // page 的入口
      entry: 'src//main.ts',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要时 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '格子图',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
    // 修复 Lazy loading routes Error： Cyclic dependency https://github.com/vuejs/vue-cli/issues/1669
    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none';
      return args;
    });
     // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
    // 添加别名
    config.resolve.alias
    .set('vue$', 'vue/dist/vue.esm.js')
    .set('@', resolve('src'))
    .set('@assets', resolve('src/assets'))
    .set('@components', resolve('src/components'))
    .set('@views', resolve('src/views'))
    .set('@router', resolve('src/router'))
    .set('@store', resolve('src/store'))
    .set('@static', resolve('src/static'));
  },
  devServer: {
    open: IS_PROD,
    host: '0.0.0.0',
    port: 8000,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API || 'http://127.0.0.1:8080',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
}  
};