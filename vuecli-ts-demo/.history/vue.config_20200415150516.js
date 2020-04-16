const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

module.exports = {
  baseUrl: "./", // 默认'/'，部署应用包时的基本 URL
  outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: '',  // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: false,  // 生产环境的 source map
  parallel: require('os').cpus().length > 1,
  pwa: {},
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
    // 修复 Lazy loading routes Error： Cyclic dependency https://github.com/vuejs/vue-cli/issues/1669
    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none';
      return args;
    });
    // 添加别名
    config.resolve.alias
    .set('vue$', 'vue/dist/vue.esm.js')
    .set('@', resolve('src'))
    .set('@assets', resolve('src/assets'))
    .set('@scss', resolve('src/assets/scss'))
    .set('@components', resolve('src/components'))
    .set('@plugins', resolve('src/plugins'))
    .set('@views', resolve('src/views'))
    .set('@router', resolve('src/router'))
    .set('@store', resolve('src/store'))
    .set('@layouts', resolve('src/layouts'))
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