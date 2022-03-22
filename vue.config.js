'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const cdnDependencies = require('./dependencies-cdn')
const { chain, set, each } = require('lodash')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const ENV = process.env.ENV
const name = defaultSettings.title || '低代码系统' // 标题

const port = process.env.port || process.env.npm_config_port || 80 // 端口

// 设置不参与构建的库
const externals = {}
cdnDependencies.forEach(pkg => { externals[pkg.name] = pkg.library })

// 引入文件的 cdn 链接
const cdnJsKey = process.env.NODE_ENV === 'production' ? 'prodJs' : 'devJs'
const cdn = {
	css: cdnDependencies.map(e => e.css).filter(e => e),
	js: cdnDependencies.map(e => e[cdnJsKey]).filter(e => e)
}

// 多页配置，默认未开启，如需要请参考 https://cli.vuejs.org/zh/config/#pages
// const pages = undefined
const pages = {
	index: {
		entry: 'src/main.js',
		template: 'public/index.html',
		filename: 'index.html',
		chunks: ['chunk-vendors', 'chunk-common', 'index']
	},
	preview: {
		entry: 'src/components/CodeEditor/views/preview/main.js',
		template: 'public/preview.html',
		filename: 'preview.html',
		chunks: ['chunk-vendors', 'chunk-common', 'preview']
	},
  parser:{
    entry:  'src/components/CodeEditor/mark/index.js',
    template:'public/parser.html',
    filename:'parser.html',
    // libraryTarget: 'umd',
    // umdNamedDefine: true
  }
}

const WebpackConf = {
  // 部署生产环境和开发环境下的URL。
  // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  pages,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: `http://2g3998603u.zicp.vip:25388`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'dev' ? 'source-map' : undefined,
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals
  },
  chainWebpack(config) {
    const htmlPluginNames = chain(pages).keys().map(page => 'html-' + page).value()
		const targetHtmlPluginNames = htmlPluginNames.length ? htmlPluginNames : ['html']
		each(targetHtmlPluginNames, name => {
			config.plugin(name).tap(options => {
				set(options, '[0].cdn', process.env.NODE_ENV === 'production' ? cdn : cdn)
				return options
			})
		})

    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    config.resolve.alias.set('vue$', 'vue/dist/vue.esm.js')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add([resolve('src/assets/icons'),resolve('src/components/CodeEditor/icons')])
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add([resolve('src/assets/icons'),resolve('src/components/CodeEditor/icons')])
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // config
    //   .when(process.env.NODE_ENV !== 'development',
    //     config => {
    //       config
    //         .plugin('ScriptExtHtmlWebpackPlugin')
    //         .after('html')
    //         .use('script-ext-html-webpack-plugin', [{
    //         // `runtime` must same as runtimeChunk name. default is `runtime`
    //           inline: /runtime\..*\.js$/
    //         }])
    //         .end()
    //       config
    //         .optimization.splitChunks({
    //           chunks: 'all',
    //           cacheGroups: {
    //             libs: {
    //               name: 'chunk-libs',
    //               test: /[\\/]node_modules[\\/]/,
    //               priority: 10,
    //               chunks: 'initial' // only package third parties that are initially dependent
    //             },
    //             elementUI: {
    //               name: 'chunk-elementUI', // split elementUI into a single package
    //               priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //               test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
    //             },
    //             commons: {
    //               name: 'chunk-commons',
    //               test: resolve('src/components'), // can customize your rules
    //               minChunks: 3, //  minimum common number
    //               priority: 5,
    //               reuseExistingChunk: true
    //             }
    //           }
    //         })
    //       config.optimization.runtimeChunk('single'),
    //       {
    //          from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
    //          to: './', //到根目录下
    //       }
    //     }
    //   )
  }
}

// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = ENV === 'parser' ? {}: WebpackConf
