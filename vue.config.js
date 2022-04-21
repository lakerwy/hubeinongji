let path = require('path');

module.exports = {
  // 选项...
  lintOnSave: 'warning',
	productionSourceMap: false,
	pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/assets/style/common.less")]
    }
  },
  configureWebpack: config => {
		config["externals"]={
			'AMap': 'AMap',
			'AMapUI': 'AMapUI'
		},
		Object.assign(config, { // 开发生产共同配置
			resolve: {
				extensions: ['.ts','.js', '.vue', '.less'],
				alias:{
					'@': path.resolve(__dirname, './src'),
					'@map': path.resolve(__dirname, './src/map'),
					'_com': path.resolve(__dirname, './src/components'),
					'_api': path.resolve(__dirname, './src/api'),
				}
			},
		})
  },
	publicPath: './', //空字符串 ('') 或是相对路径 ('./')
	devServer: {
		proxy: {
			"/arcgis": {
        target: "http://223.75.53.178:8399", // 目标代理接口地址
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/arcgis/": "/arcgis/"
        }
      },
			'/api_detail': { // 农机详情
				target: 'http://192.168.99.78:8890/', //韩
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/api_detail': '/'
				}
			},
			'/': { // 总的后台接口,放在最后
				// target: 'http://192.168.99.78:9999', //韩
				// target: 'http://192.168.99.61:9999/', //田
				target: 'http://192.168.250.116:9999', //柯
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/': '/'
				}
			},
		}
	}
}