<template>
  <div class="contaner-full">
    <header-bar></header-bar>
    <div class="content">
      <nav-bar style="height:100%"></nav-bar>
      <div class="wrap">
        <div class="main">
          <parser
            :form-conf="formConf"
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
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    sumbitForm(data) {
      console.log("sumbitForm1提交数据：", data);
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.contaner-full {
  display: flex;
  flex-direction: column;
  height: 100%;
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
