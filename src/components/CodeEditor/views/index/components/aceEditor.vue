<template>
  <el-dialog
    title="组件事件处理"
    :visible.sync="editorDialog"
    width="70%"
    :modal-append-to-body="false"
    :append-to-body="true"
  >
    <div class="editor-box">
      <span>{{ name }}(){</span>
      <ace
        ref="editor"
        :value="content"
        @init="initEditor"
        :lang="lang"
        :height="height === 0 ? '500' : height"
        :theme="theme"
        :options="options"
        width="100%"
        v-bind="config"
      >
      </ace>
      <span>}</span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editorDialog = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ace from "vue2-ace-editor";
export default {
  name: "SqlEditor",
  components: {
    ace,
  },
  data() {
    return {
      editorDialog: false,
      name: "",
      contentText: "",
    };
  },
  props: {
    content: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      default: 0,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "monokai",
    },
    lang: {
      type: String,
      default: "sql",
    },
    config: {
      type: Object,
      default: () => {
        return {
          font_size: 16,
          sql_atom: true,
        };
      },
    },
  },
  computed: {
    options() {
      if (this.readOnly) {
        return {
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: this.config.sql_atom,
          showPrintMargin: false,
          fontSize: this.config.font_size,
          readOnly: true,
        };
      }
      return {
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: this.config.sql_atom,
        showPrintMargin: false,
        fontSize: this.config.font_size,
      };
    },
  },
  created() {},
  methods: {
    initEditor(editor) {
      require("brace/ext/language_tools");
      // 设置语言
      require("brace/mode/sql");
      require("brace/snippets/sql");
      // 设置主题 按需加载
      require("brace/theme/monokai");
      require("brace/theme/chrome");
      require("brace/theme/crimson_editor");
      // 监听值的变化
      editor.getSession().on("change", (val) => {
        this.contentText = editor.getValue();
      });
    },
    submit() {
      this.$emit("change", this.contentText);
      this.editorDialog = false;
    },
  },
};
</script>
<style>
.editor-box {
  min-height: 500px;
}
</style>