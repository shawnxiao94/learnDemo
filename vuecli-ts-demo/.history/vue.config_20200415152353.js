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
  // 防止将某些 import 的包(package)打包到 bundle 中，
  // 而是在运行时(runtime)再去从外部获取这些扩展依赖
  configureWebpack: config => {
    config.devtool = 'cheap-source-map'
    config.externals = {
      // cdn 版本的element-ui、vue、vue-router设置的全局变量分别是ELEMENT、Vue、VueRouter、axios、VueI18n
      vue: 'Vue',
      axios: 'axios'
      // 'vue-router': 'VueRouter',
      // vuex: 'Vuex',
      // 'element-ui': 'ELEMENT'
      // i18n: 'VueI18n',
      // echarts: 'echarts'
    }
    if (IS_PROD) {
      const plugins = []
      // 去除多余无效的 css
      plugins.push(
        new PurgecssPlugin({
          paths: glob.sync([resolve('./**/*.vue')]),
          extractors: [
            {
              extractor: class Extractor {
                static extract(content) {
                  const validSection = content.replace(
                    /<style([\s\S]*?)<\/style>+/gim,
                    ''
                  )
                  return validSection.match(/[A-Za-z0-9-_:/]+/g) || []
                }
              },
              extensions: ['html', 'vue']
            }
          ],
          whitelist: ['html', 'body'],
          whitelistPatterns: [/el-.*/],
          whitelistPatternsChildren: [/^token/, /^pre/, /^code/]
        })
      )
      // 开启 gzip 压缩
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      )
      config.plugins = [...config.plugins, ...plugins]
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

    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    // 链式配置
    config.module.rules.delete('svg') //重点:删除默认配置中处理svg,
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons')) //处理svg目录
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/\.svg$/)
      .exclude.add(resolve('src/assets/icons'))
      .end()
      .use('file-loader')
      .loader('file-loader')    
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