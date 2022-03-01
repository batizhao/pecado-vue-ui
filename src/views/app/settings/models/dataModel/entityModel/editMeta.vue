<template>
  <div>
    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 30px;">
      <el-step title="基本信息"></el-step>
      <el-step title="生成信息"></el-step>
    </el-steps>
    <basic-info-form v-show="active === 0" ref="basicInfo" :info="code" :genarateInfo="genarateInfo" />
    <gen-info-form v-show="active === 1" ref="genInfo" :info="genarateInfo" :tables="codes" :menus="menus"/>
    <div class="action-buttons" v-show="active === 0">
      <action-button :plain="false" size="medium" @click="stepOneSubmit">下一步</action-button>
    </div>
    <div class="action-buttons" v-show="active === 1">
      <action-button type="text" size="medium" @click="active = 0">上一步</action-button>
      <action-button :plain="false" size="medium" @click="stepTwoSubmit" :loading="saveLoading">保存</action-button>
      <action-button  size="medium" @click="genarateCode" :loading="genarateLoading">生成代码</action-button>
    </div>
  </div>
</template>
<script>
import { listMenu as getMenuTreeSelect } from "@/api/ims/menu";
import { entityModelDetail, updateCodeMetadata, genCode } from '@/api/app/dataModel.js'
import basicInfoForm from "./basicInfoForm";
import genInfoForm from "./genInfoForm";
import { downLoadZip } from "@/utils/download";

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
      // 选中步骤
      active: 0,
      // 表信息
      codes: [],
      // 表列信息
      codeMetas: [],
      // 菜单信息
      menus: [],
      // 表详细信息
      code: {},
      // 生成信息
      genarateInfo: {},
      saveLoading: false,
      genarateLoading: false
    };
  },
  created() {
    entityModelDetail(this.entityModelId).then(res => {
      let codeMetadata = res.data.codeMetadata
      if (codeMetadata) {
        this.genarateInfo = JSON.parse(codeMetadata)
      }
      this.code = res.data
      this.codes = [] // 生成模板为一对多表时，这个数组应该要有接口字段，但是暂时没有
    })
    /** 查询菜单下拉列表 */
    getMenuTreeSelect().then(response => {
      this.menus = response.data;
    });
  },
  methods: {
    stepOneSubmit () {
      const basicForm = this.$refs.basicInfo.$refs.basicInfoForm
      basicForm.validate(valid => {
        if (valid) {
          this.active = 1
        }
      })
    },
    stepTwoSubmit () {
      const genForm = this.$refs.genInfo.$refs.genInfoForm
      genForm.validate(valid => {
        if (valid) {
          this.saveLoading = true
          updateCodeMetadata({ 
            id: this.entityModelId,
            codeMetadata: JSON.stringify(this.genarateInfo)
          }).then(() => {
            this.saveLoading = false
            this.msgSuccess('保存成功');
            this.$emit('success')
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    },
    genarateCode () {
      if (this.genarateInfo.type === 'zip') {
        // zip下载
        downLoadZip("/app/table/zip/" + this.entityModelId)
      } else if (this.genarateInfo.type === 'path') {
        // 自定义路径下载
        this.genarateLoading = true
        genCode(this.entityModelId).then(() => {
          this.msgSuccess("成功生成到自定义路径：" + this.genarateInfo.path);
          this.genarateLoading = false
        }).catch(() => {
          this.genarateLoading = false
        })
      } else {
        console.error('下载方式不支持');
      }
    }
  }
};
</script>
<style scoped>
.action-buttons {
  text-align: center;
}
</style>