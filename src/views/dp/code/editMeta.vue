<template>
  <div class="app-container" :style="isDialog ? { padding: 0 } : ''">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <basic-info-form ref="basicInfo" :info="code" />
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="cloum" v-if="!isDialog">
        <el-table ref="dragTable" :data="codeMetas" row-key="id" :max-height="tableHeight">
          <el-table-column label="序号" type="index" min-width="5%" class-name="allowDrag" />
          <el-table-column
            label="字段列名"
            prop="columnName"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="字段描述" min-width="10%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.columnComment"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="物理类型"
            prop="columnType"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="Java类型" min-width="11%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.javaType">
                <el-option label="Long" value="Long" />
                <el-option label="String" value="String" />
                <el-option label="Integer" value="Integer" />
                <el-option label="Double" value="Double" />
                <el-option label="BigDecimal" value="BigDecimal" />
                <el-option label="Date" value="Date" />
                <el-option label="LocalDateTime" value="LocalDateTime" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="java属性" min-width="10%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.javaField"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="插入" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.save" />
            </template>
          </el-table-column>
          <el-table-column label="编辑" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.edit" />
            </template>
          </el-table-column>
          <el-table-column label="列表" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.display" />
            </template>
          </el-table-column>
          <el-table-column label="查询" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.search" />
            </template>
          </el-table-column>
          <el-table-column label="查询方式" min-width="10%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.searchType">
                <el-option label="=" value="EQ" />
                <el-option label="!=" value="NE" />
                <el-option label=">" value="GT" />
                <el-option label=">=" value="GTE" />
                <el-option label="<" value="LT" />
                <el-option label="<=" value="LTE" />
                <el-option label="LIKE" value="LIKE" />
                <el-option label="BETWEEN" value="BETWEEN" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.required" />
            </template>
          </el-table-column>
          <el-table-column label="显示类型" min-width="12%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.htmlType">
                <el-option label="单行文本" value="input" />
                <el-option label="多行文本" value="textarea" />
                <el-option label="下拉选择框" value="select" />
                <el-option label="单选框" value="radio" />
                <el-option label="多选框" value="checkbox" />
                <el-option label="开关" value="switch" />
                <el-option label="日期选择器" value="datetime" />
                <el-option label="图片" value="imageUpload" />
                <el-option label="文件" value="fileUpload" />
                <el-option label="编辑器" value="editor" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="字典类型" min-width="12%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择">
                <el-option
                  v-for="dict in dictOptions"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code">
                  <span style="float: left">{{ dict.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.code }}</span>
              </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="生成信息" name="genInfo">
        <gen-info-form ref="genInfo" :info="code" :tables="codes" :menus="menus"/>
      </el-tab-pane>
    </el-tabs>
    <el-form label-width="100px" v-if="!isDialog">
      <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getCode, addOrUpdateCode } from "@/api/dp/code";
import { optionSelect as getDictOptionSelect } from "@/api/system/dict/type";
import { listMenu as getMenuTreeSelect } from "@/api/ims/menu";
import { entityModelDetail } from '@/api/app/dataModel.js'
import basicInfoForm from "./basicInfoForm";
import genInfoForm from "./genInfoForm";
import Sortable from 'sortablejs'

export default {
  name: "EditMeta",
  components: {
    basicInfoForm,
    genInfoForm
  },
  props: {
    isDialog: Boolean,
    entityModelId: Number
  },
  data() {
    return {
      // 选中选项卡的 name
      activeName: this.isDialog ? 'basic' : 'cloum',
      // 表格的高度
      tableHeight: document.documentElement.scrollHeight - 245 + "px",
      // 表信息
      codes: [],
      // 表列信息
      codeMetas: [],
      // 字典信息
      dictOptions: [],
      // 菜单信息
      menus: [],
      // 表详细信息
      code: {}
    };
  },
  created() {
    if (this.isDialog) {
      entityModelDetail(this.entityModelId).then(res => {
        console.log("🚀 ~ file: editMeta.vue ~ line 171 ~ entityModelDetail ~ res", res)
        this.code = {}
        this.codes = {}
      })
    } else {
      const id = this.$route.params && this.$route.params.id
      if (id) {
        // 获取表详细信息
        getCode(id).then(res => {
          this.codeMetas = res.data.codeMetas;
          this.code = res.data.code;
          this.codes = res.data.codes;
        });
        /** 查询字典下拉列表 */
        getDictOptionSelect().then(response => {
          this.dictOptions = response.data;
        });
      }
    }
    /** 查询菜单下拉列表 */
    getMenuTreeSelect().then(response => {
      this.menus = response.data;
    });
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      const basicForm = this.$refs.basicInfo.$refs.basicInfoForm;
      const genForm = this.$refs.genInfo.$refs.genInfoForm;
      Promise.all([basicForm, genForm].map(this.getFormPromise)).then(res => {
        const validateResult = res.every(item => !!item);
        if (validateResult) {
          const genTable = Object.assign({}, basicForm.model, genForm.model);
          genTable.codeMetaList = this.codeMetas;
          addOrUpdateCode(genTable).then(res => {
            this.msgSuccess(res.message);
            if (res.code === 0) {
              this.close();
            }
          });
        } else {
          this.msgError("表单校验未通过，请重新检查提交内容");
        }
      });
    },
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res);
        });
      });
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/dp/code", query: { t: Date.now()}})
    }
  },
  mounted() {
    if (this.$refs.dragTable) {
      const el = this.$refs.dragTable.$el.querySelectorAll(".el-table__body-wrapper > table > tbody")[0];
      const sortable = Sortable.create(el, {
        handle: ".allowDrag",
        onEnd: evt => {
          const targetRow = this.codeMetas.splice(evt.oldIndex, 1)[0];
          this.codeMetas.splice(evt.newIndex, 0, targetRow);
          for (let index in this.codeMetas) {
            this.codeMetas[index].sort = parseInt(index) + 1;
          }
        }
      });
    }
  }
};
</script>
