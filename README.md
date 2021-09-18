# Pecado UI by VUE.
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
# 构建生产环境
npm run build:prod
```

## 连接后端设置

登录账号 admin/123456

vue.config.js:

```js
[process.env.VUE_APP_BASE_API]: {
  target: `http://127.0.0.1:8888`,
  changeOrigin: true,
  pathRewrite: {
    ['^' + process.env.VUE_APP_BASE_API]: ''
  }
}
```

http://127.0.0.1:8888 指向后端服务。