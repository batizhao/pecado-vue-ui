<template>
  <!-- 预览界面 -->
  <el-dialog :title="preview.title" :visible.sync="preview.open" width="80%" top="5vh" append-to-body>
    <el-tabs v-model="preview.activeName">
      <el-tab-pane
        v-for="(value, key) in preview.data"
        :label="key"
        :name="key"
        :key="key"
      >
        <pre><code class="hljs" v-html="highlightedCode(value, key)"></code></pre>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { previewCode } from "@/api/dp/code";
import hljs from "highlight.js/lib/core";
import "highlight.js/styles/github-gist.css";
hljs.registerLanguage("java", require("highlight.js/lib/languages/java"));
hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("html", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("vue", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));
hljs.registerLanguage("sql", require("highlight.js/lib/languages/sql"));
export default {
  data () {
    return {
      // 预览参数
      preview: {
        open: false,
        title: "代码预览",
        data: {},
        activeName: "Domain.java"
      }
    }
  },
  methods: {
    /** 预览按钮 */
    open(id) {
      // this.preview.data = {
      //   'Domain.java': `
      //       import Vue from 'vue'
      //       import App from './App.vue'
      //       import router from './router'
      //       import store from './store'

      //       Vue.config.productionTip = false

      //       new Vue({
      //         router,
      //         store,
      //         render: h => h(App),
      //         mounted: () => document.dispatchEvent(new Event("x-app-rendered")),
      //       }).$mount('#app')
      //     `
      //   }
      // this.preview.open = true;
      previewCode(id).then(response => {
        this.preview.data = response.data;
        this.preview.open = true;
      });
    },
    /** 高亮显示 */
    highlightedCode(code, key) {
      let language = key.substring(key.lastIndexOf(".") + 1, key.length);
      const result = hljs.highlight(language, code || "", true);
      return result.value || '&nbsp;';
    },
  }
}
</script>
