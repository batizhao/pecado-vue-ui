<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <basic-info-form ref="basicInfo" :info="code" />
      </el-tab-pane>
      <el-tab-pane label="生成信息" name="genInfo">
        <gen-info-form ref="genInfo" :info="code" :tables="codes" :menus="menus"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { listMenu as getMenuTreeSelect } from "@/api/ims/menu";
import { entityModelDetail, addOrUpdateCode } from '@/api/app/dataModel.js'
import basicInfoForm from "./basicInfoForm";
import genInfoForm from "./genInfoForm";

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
      activeName: 'basic',
      // 表信息
      codes: [],
      // 表列信息
      codeMetas: [],
      // 菜单信息
      menus: [],
      // 表详细信息
      code: {}
    };
  },
  created() {
    entityModelDetail(this.entityModelId).then(res => {
      let codeMetadata = res.data.codeMetadata
      if (codeMetadata) {
        codeMetadata = JSON.parse(codeMetadata)
      }
      this.code = { ...res.data, ...codeMetadata }
      this.codes = []
    })
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
            this.msgSuccess('生成代码成功');
            this.close();
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
      this.$emit('success')
    }
  }
};
</script>
