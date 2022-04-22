<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="事件属性" name="1">
        <el-form-item label="onCreated">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-edit-outline"
            round
            @click="onSubmit('onCreated')"
            >编写代码</el-button
          >
        </el-form-item>
        <el-form-item label="onMounted">
          <el-button
            type="info"
            size="mini"
            icon="el-icon-edit-outline"
            round
            @click="onSubmit('onMounted')"
            >编写代码</el-button
          >
        </el-form-item>
      </el-collapse-item>
    </el-collapse>
    <editor
      ref="editors"
      :content="ifCreated ? activeData.createdCode : activeData.mountedCode"
      :theme="'crimson_editor'"
      :config="config"
      :height="height"
      @change="editorChange"
    ></editor>
  </div>
</template>

<script>
import editor from "./aceEditor.vue";
import mixins from "./mixins";
export default {
  mixins: [mixins],
  components: {
    editor,
  },
  data() {
    return {
      activeNames: ["1"], //打开的折叠面板
      content: "", //代码编辑器的内容
      config: {},
      height: 0, //代码编辑器弹框的高度
      ifCreated: true, //判断是点击created还是mounted的编辑代码打开
    };
  },
  created() {},
  methods: {
    //打开代码编辑弹框
    onSubmit(val) {
      this.$refs.editors.editorDialog = true;
      this.$refs.editors.name = this.activeData.__vModel__ + "  " + val;
      this.ifCreated = val === "onCreated" ? true : false;
    },
    //接收代码编辑弹框中编辑的代码
    editorChange(val) {
      if (this.ifCreated) {
        this.activeData.createdCode = val;
      } else {
        this.activeData.mountedCode = val;
      }
    },
  },
};
</script>
