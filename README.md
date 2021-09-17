# Pecado UI by VUE.
基于 [若依](http://ruoyi.vip) 前端 UI。

## 开发

```bash
# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

# 连接后端设置

登录账号 admin
登录密码 123456
 
vue.config.js:本地代理配置

[process.env.VUE_APP_BASE_API]: {
  target: `http://gateway.stalber.com/api`,
  changeOrigin: true,
  pathRewrite: {
    ['^' + process.env.VUE_APP_BASE_API]: ''
  }
}

windows 添加 host 配置：172.31.21.180 gateway.stalber.com
需要连接办公室代理机