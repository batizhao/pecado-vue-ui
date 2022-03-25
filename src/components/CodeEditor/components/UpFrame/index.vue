<template>
  <div class="contaner-full">
    <header-bar :menuData="headerBarMenuData"></header-bar>
    <div class="content">
      <render-menu
        style="height:100%; width: 200px;"
        :menuData="navBarMenuData"
        :default-active="sideActiveIndex"
        @selectItem="navBarSelect"
      ></render-menu>
      <div class="wrap">
        <div class="wrap-box">
          <div class="main">
            <parser
              v-if="parserShow && parserFormConf"
              :form-conf="parserFormConf"
              :showSubmit="false"
            />
          </div>
          <footer-bar></footer-bar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Parser from "@/components/CodeEditor/components/parser";
import { getNavBarData } from '@/api/app/menu.js'
import { getTemplateDetail } from '@/api/dp/page/model.js'
import RenderMenu from '../NavBar/renderMenu.vue';
export default {
  name: "up-frame",
  components: {
    Parser,
    RenderMenu
  },
  data() {
    return {
      parserFormConf: null,
      parserShow: true,
      navBarMenuData: [],
      headerBarMenuData: [
        // {
        //   label: '导航一',
        //   index: '1',
        //   icon: 'fa fa-send'
        // },
        // {
        //   label: '导航二',
        //   index: '2'
        // }
      ],
      sideActiveIndex: ''
    };
  },
  watch: {
    $route () {
      this.setDefault()
    }
  },
  async created () {
    await this.getNavBarData()
    this.setDefault()
  },
  methods: {
    setDefault () {
      const { appPageCode, pageModelCode, id } = this.$route.query
      if (appPageCode) {
        this.getFrame({ appPageCode, pageModelCode })
        this.sideActiveIndex = id.toString()
      } else {
        // 默认选中第一个菜单
        this.navBarSelect(this.navBarMenuData[0])
        this.sideActiveIndex = this.navBarMenuData[0].id.toString()
      }
    },
    // 获取侧边栏菜单数据
    getNavBarData () {
      return getNavBarData().then(res => {
        const recursion = list => {
          for (let item of list) {
            item.label = item.name
            item.index = String(item.id)
            if (item.children && item.children.length) {
              recursion(item.children)
            }
          }
        }
        recursion(res.data)
        this.navBarMenuData = this.navBarMenuData.concat(res.data)
      })
    },
    // 侧边菜单选中事件
    navBarSelect (data) {
      const currentPath = this.$route.path
      this.$router.push({
        path: currentPath,
        query: {
          id: data.id,
          appId: data.appId,
          appPageCode: data.appPageCode,
          pageModelCode: data.pageModelCode
        }
      })
    },
    // 获取框架
    getFrame({ appPageCode, pageModelCode }){
      // 通过appPageCode查询出页面模型的类型
      // 根据类型决定渲染什么页面
      this.parserShow = false
      getTemplateDetail(appPageCode).then(res => {
        const pageMetadata = JSON.parse(res.data.pageMetadata)
        if (pageMetadata && Object.keys(pageMetadata).length) {
          if (res.data.type === 'form') {
            this.getFormContainerData(pageMetadata.fields, pageModelCode)
          }
          if (res.data.type === 'list') {
            this.getListContainerData(pageMetadata.fields, pageModelCode)
          }
          this.parserFormConf = pageMetadata
          this.parserShow = true
        }
      })
    },
    // 针对表单容器要传入pageModelCode查询页面JSON
    getFormContainerData (fields, pageModelCode) {
      // 找到表单容器，并给url赋值
      const recursion = list => {
        for (let item of list) {
          if (item.__config__.tag === 'form-container') {
            item.url = '/app/form?key=' + pageModelCode
          }
          if (item.children && item.children.length) {
            recursion(item.children)
          }
        }
      }
      recursion(fields)
    },
    // 针对列表容器要传入pageModelCode查询页面的数据配置
    getListContainerData (fields, pageModelCode) {
      // 找到列表容器，并给url赋值
      const recursion = list => {
        for (let item of list) {
          if (item.__config__.tag === 'list-container') {
            item.url = '/app/list/by/' + pageModelCode
          }
          if (item.children && item.children.length) {
            recursion(item.children)
          }
        }
      }
      recursion(fields)
    },
    sumbitForm(data) {
      console.log("sumbitForm1提交数据：", data);
    }
  }
};
</script>
<style lang="scss" scoped>
.contaner-full {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  display: flex;
  flex: 1;
  overflow-x: hidden;
}
.wrap {
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
  background: #f0f2f5;
  padding: 15px;
  box-shadow: 0px 0px 5px 2px #dddbdb inset;
  overflow: auto;
  .wrap-box {
    background: #fff;
  }
}
.main {
  padding: 20px;
  flex: 1;
}
</style>
