<template>
  <div class="contaner-full">
    <header-bar></header-bar>
    <div class="content">
      <nav-bar
        style="height:100%; width: 200px;"
        :menuData="navBarMenuData"
        @select="navBarSelect"
      ></nav-bar>
      <div class="wrap">
        <div class="main">
          <parser
            v-if="parserShow"
            :form-conf="parserFormConf"
            :edit-data="editData"
            @submit="sumbitForm"
            :showSubmit="false"
          />
        </div>
        <footer-bar></footer-bar>
      </div>
    </div>
  </div>
</template>

<script>
import Parser from "@/components/CodeEditor/components/parser";
import { getNavBarData } from '@/api/app/menu.js'
import { getPageModelBy} from '@/api/dp/page/model.js'
import { deepClone } from '@/components/CodeEditor/utils/index'
export default {
  name: "up-frame",
  components: {
    Parser
  },
  props: {
    formConf:{
      type:Object,
      default:_=>{
        return {}
      }
    },
    editData:{
      type:Object,
      default:_=>{
        return {}
      }
    }
  },
  data() {
    return {
      parserFormConf: deepClone(this.formConf),
      parserShow: true,
      navBarMenuData: [
        {
          label: '导航1',
          index: '1'
        },
        {
          label: '导航2',
          index: '2',
          children: [
            {
              label: '导航2-1',
              index: '3'
            }
          ]
        }
      ]
    };
  },
  created () {
    this.getNavBarData()
  },
  methods: {
    // 获取侧边栏菜单数据
    getNavBarData () {
      getNavBarData().then(res => {

      })
    },
    // 侧边菜单选中事件
    navBarSelect (data) {
    console.log("🚀 ~ file: index.vue ~ line 79 ~ navBarSelect ~ data", data)
    if (data === '1') {
      this.getFormFrame()
    }

    },
    // 获取表单框架
    getFormFrame(){
      this.parserShow = false
      const params={
        type:'form',
        status:"open"
      }
      getPageModelBy(params).then(res => {
        this.parserFormConf = JSON.parse(res.data.pageMetadata)
        this.parserShow = true
      })
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
}
.wrap {
  display: flex;
  flex: 1;
  height: 100%;
  flex-direction: column;
}
.main {
  padding: 20px;
  flex: 1;
}
</style>
