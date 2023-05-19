const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //关闭eslint语法校验
  lintOnSave: false,
  //配置代理解决跨域请求问题
  devServer: {
    proxy: {
      //只要请求路径是以/api开头，就把请求转发给目标url
      "/api": {
        target: "http://gmall-h5-api.atguigu.cn",
        //由于本项目请求地址都带了api,这里就不用去掉了
        // pathRewrite: { '^/api': '' },
      }
    }
  }
})
