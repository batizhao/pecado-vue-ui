import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/ParentView';
import PageLayout from '@/components/pageLayout'
/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '/home',//门户
    component: (resolve) => require(['@/views/home'], resolve),
    hidden: true
  },
  // {
  //   path: '/portal',// 门户配置
  //   component: Layout,
  //   redirect: '',
  //   children: [
  //     {
  //       path: '',
  //       component: (resolve) => require(['@/views/portal'], resolve),
  //       name: '门户配置',
  //       meta: { title: '门户配置', icon: 'dashboard', affix: true }
  //     },
  //   ]
  // },
  // {
  //   path: '/page',
  //   component: (resolve) => require(['@/components/pageLayout'], resolve),
  //   hidden: true,
  // },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/dashboard'], resolve),
        name: '工作台',
        meta: { title: '工作台', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noRedirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/ims/user/profile/index'], resolve),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    redirect: 'noRedirect',
    meta: { title: '字典管理' },
    children: [
      {
        path: 'data/:code(\\w+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: '字典数据',
        meta: { title: '字典数据', icon: 'dict', activeMenu: '/system/dict' }
      }
    ]
  },
  // {
  //   path: '/job',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'log',
  //       component: (resolve) => require(['@/views/monitor/job/log'], resolve),
  //       name: '调度日志',
  //     }
  //   ]
  // },
  // {
  //   path: '/code',
  //   component: Layout,
  //   hidden: true,
  //   redirect: 'noRedirect',
  //   meta: { title: '代码生成' },
  //   children: [
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: (resolve) => require(['@/views/dp/code/editMeta'], resolve),
  //       name: '编辑配置',
  //       meta: { title: '编辑配置', icon: 'code', activeMenu: '/dp/code' }
  //     }
  //   ]
  // },
  {
    path: '/form',
    component: Layout,
    hidden: true,
    redirect: 'noRedirect',
    meta: { title: '表单管理' },
    children: [
      {
        path: 'design/:formKey?',
        component: (resolve) => require(['@/views/dp/form/design'], resolve),
        name: 'FormDesign',
        meta: { title: '表单设计', icon: 'form', activeMenu: '/dp/form' }
      },
      {
        path: 'history/:formKey?',
        component: (resolve) => require(['@/views/dp/form/history'], resolve),
        name: 'FormVersion',
        meta: { title: '表单版本', icon: 'form', activeMenu: '/dp/form' }
      }
    ]
  },
  {
    path: '/parse',
    component: Layout,
    redirect: 'noRedirect',
    hidden: true,
    children: [
      {
        path: '/parse',
        component: (resolve) => require(['@/components/CodeEditor/components/parser/example/Index.vue'], resolve),
        name: 'parse',
        meta: { title: '解析', icon: 'form'}
      }
    ]
  },
  {
    path: '/app',
    component: Layout,
    hidden: true,
    redirect: 'noRedirect',
    meta: { title: '应用开发' },
    children: [
      {
        path: 'settings/:appId',
        component: () => import('@/views/app/settings/index.vue'),
        name: 'appSettings',
        meta: { title: '应用配置', activeMenu: '/app/dev' }
      }
    ]
  }

]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
