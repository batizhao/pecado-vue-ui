<template>
  <div>
    <el-form size="small" label-width="90px">
      <el-divider>选项</el-divider>
      <el-form-item label="数据类型">
        <el-select
          v-model="activeData.__config__.dataType"
          placeholder="请选择"
          @change="changeRenderKey"
        >
          <el-option
            label="自定义"
            value="static"
            v-if="
              !['department-selector-2'].includes(activeData.__config__.tag)
            "
          ></el-option>
          <el-option
            v-if="
              [
                'object-selector',
                'object-cascader',
                'department-selector-1',
                'department-selector-2',
              ].includes(activeData.__config__.tag)
            "
            label="动态数据"
            value="dynamic"
          ></el-option>
        </el-select>
      </el-form-item>
      <template v-if="activeData.props && activeData.props.props">
        <el-form-item label="标签键名">
          <el-input
            v-model="activeData.props.props.label"
            placeholder="请输入标签键名"
            @change="changeRenderKey"
          />
        </el-form-item>
        <el-form-item label="值键名">
          <el-input
            v-model="activeData.props.props.value"
            placeholder="请输入值键名"
            @change="changeRenderKey"
          />
        </el-form-item>
        <el-form-item v-if="activeData.props.props.children" label="子级键名">
          <el-input
            v-model="activeData.props.props.children"
            placeholder="请输入子级键名"
            @change="changeRenderKey"
          />
        </el-form-item>
      </template>

      <template v-if="activeData.__config__.dataType === 'dynamic'">
        <dynamic 
          :activeData="activeData" 
          @changeRenderKey="changeRenderKey"
        ></dynamic>
      </template>

      <template v-if="activeData.__config__.dataType === 'static'">
        <template
          v-if="
            [
              'object-checkbox-group',
              'object-radio-group',
              'object-selector',
            ].includes(activeData.__config__.tag)
          "
        >
          <static-list 
            :activeData="activeData" 
            @changeRenderKey="changeRenderKey"
            @editStaticData="editStaticData"
          ></static-list>
        </template>
        <template
          v-if="
            [
              'object-cascader',
              'department-selector-1'
            ].includes(activeData.__config__.tag)
          "
        >
          <static-tree 
            :activeData="activeData" 
            @changeRenderKey="changeRenderKey"
            @editStaticData="editStaticData"
          ></static-tree>
        </template>
      </template>

      <action-dialog
        v-model="editStaticDataVisible"
        title="JSON数据"
        @confirm="editStaticDataConfirm"
      >
        <div id="staticDataEditorJs" style="height: 400px" />
        <template v-slot:footer>
          <el-upload
            action=""
            accept="application/json"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="uploadJsonOnchange"
            style="display: line-block"
          >
            <el-button
              slot="trigger"
              size="small"
              type="primary"
              style="margin-right: 10px"
              icon="el-icon-download"
              >导入JSON</el-button>
          </el-upload>
        </template>
      </action-dialog>
    </el-form>
  </div>
</template>
<script>
import dynamic from './dynamic.vue'
import staticList from './staticList.vue'
import staticTree from './staticTree.vue'
import mixins from "../mixins";
import { mapMutations } from "vuex";
import loadMonaco from "@/components/CodeEditor/utils/loadMonaco";
import loadBeautifier from "@/components/CodeEditor/utils/loadBeautifier";
import { beautifierConf } from "@/components/CodeEditor/utils/index";
let monaco;
let beautifier;
export default {
  components: {
    dynamic,
    staticList,
    staticTree
  },
  mixins: [mixins],
  data() {
    return {
      editStaticDataVisible: false
    }
  },


  methods: {
    ...mapMutations("codeEditor/components", ["changeRenderKey"]),
    editStaticData(options) {
      this.editStaticDataVisible = true;
      this.$nextTick(() => {
        this.setStaticDataEditorValue(JSON.stringify(options))
      });
    },
    setStaticDataEditorValue (editorValue) {
      loadBeautifier((btf) => {
        beautifier = btf;
        this.beautifierJson = beautifier.js(
          editorValue,
          beautifierConf.js
        );
        loadMonaco((val) => {
          monaco = val;
          const codeStr = this.beautifierJson
          if (this.jsonEditor) {
            this.jsonEditor.setValue(codeStr);
          } else {
            this.jsonEditor = monaco.editor.create(
              document.getElementById("staticDataEditorJs"),
              {
                value: codeStr,
                theme: "vs-dark",
                language: "json",
                automaticLayout: true,
              }
            );
          }
        });
      })
    },
    editStaticDataConfirm() {
      try {
        const value = JSON.parse(this.jsonEditor.getValue())
        this.activeData.options && (this.activeData.options = value)
        this.activeData.__slot__ && this.activeData.__slot__.options && (this.activeData.__slot__.options = value)
        this.editStaticDataVisible = false
      } catch (err) {
        this.msgError(err);
      }
    },
    uploadJsonOnchange(file) {
      if (file.raw.type !== 'application/json') {
        this.msgError('请导入.json文件')
        return 
      }
      const reader = new FileReader()
      reader.onload = result => {
        console.log("🚀 ~ file: index.vue ~ line 195 ~ uploadJsonOnchange ~ result", result.target.result)
        this.setStaticDataEditorValue(result.target.result)
        this.msgSuccess('导入成功')
      }
      reader.readAsText(file.raw)
    }
  },
};
</script>
