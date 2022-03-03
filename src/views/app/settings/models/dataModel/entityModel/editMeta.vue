<template>
  <div>
    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 30px;">
      <el-step title="基本信息"></el-step>
      <el-step title="表单配置"></el-step>
      <el-step title="生成信息"></el-step>
    </el-steps>
    <basic-info-form v-show="active === 0" ref="basicInfo" :info="code" :genarateInfo="genarateInfo" />
    <configure-form v-show="active === 1" ref="configureForm" v-if="columnMetadata" :columnMetadata="columnMetadata"></configure-form>
    <gen-info-form v-show="active === 2" ref="genInfo" :info="genarateInfo" :tables="codes" :menus="menus"/>
    <div class="action-buttons" v-show="active === 0">
      <action-button :plain="false" size="medium" @click="basicInfoSubmit">下一步</action-button>
    </div>
    <div class="action-buttons" v-show="active === 1">
      <action-button type="text" size="medium" @click="active = 0">上一步</action-button>
      <action-button :plain="false" size="medium" @click="configureFormSubmit">下一步</action-button>
    </div>
    <div class="action-buttons" v-show="active === 2">
      <action-button type="text" size="medium" @click="active = 1">上一步</action-button>
      <action-button :plain="false" size="medium" @click="updateCodeMetadata" :loading="saveLoading">保存</action-button>
      <action-button  size="medium" @click="genarateCode" :loading="genarateLoading">生成代码</action-button>
    </div>
  </div>
</template>
<script>
import { listMenu as getMenuTreeSelect } from "@/api/ims/menu";
import { entityModelDetail, updateCodeMetadata, genCode, getTableRelations } from '@/api/app/dataModel.js'
import basicInfoForm from "./basicInfoForm";
import genInfoForm from "./genInfoForm";
import configureForm from './configureForm.vue'
import { downLoadZip } from "@/utils/download";

export default {
  name: "EditMeta",
  components: {
    basicInfoForm,
    genInfoForm,
    configureForm
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
      // 列配置列表
      columnMetadata: null,
      saveLoading: false,
      genarateLoading: false
    };
  },
  created() {
    entityModelDetail(this.entityModelId).then(res => {
      console.log("🚀 ~ file: editMeta.vue ~ line 62 ~ entityModelDetail ~ res", res)
      // columnMetadata数组的对象里没有某些属性，初始化给他加上
      this.columnMetadata = JSON.parse(res.data.columnMetadata).map(item => {
        item.javaType = ''
        item.javaField = ''
        item.save = false
        item.htmlType = ''
        return item
      })
      let codeMetadata = res.data.codeMetadata
      if (codeMetadata) {
        this.genarateInfo = JSON.parse(codeMetadata)
        this.getTableRelations()
      }
      this.code = res.data
    })
    
    /** 查询菜单下拉列表 */
    getMenuTreeSelect().then(response => {
      this.menus = response.data;
    });
  },
  methods: {
    basicInfoSubmit () {
      const basicForm = this.$refs.basicInfo.$refs.basicInfoForm
      basicForm.validate(valid => {
        if (valid) {
          this.active = 1
        }
      })
    },
    configureFormSubmit () {
      const configureForm = this.$refs.configureForm.$refs.form
      configureForm.validate(valid => {
        if (valid) {
          this.active = 2
        } else {
          this.msgError('请填写完整')
        }
      })
    },
    updateCodeMetadata (isFromGenarateCode) {
      return new Promise((resolve, reject) => {
        const genForm = this.$refs.genInfo.$refs.genInfoForm
        genForm.validate(valid => {
          if (valid) {
            this.saveLoading = true
            updateCodeMetadata({ 
              id: this.entityModelId,
              codeMetadata: JSON.stringify(this.genarateInfo),
              columnMetadata: JSON.stringify(this.columnMetadata)
            }).then(() => {
              this.saveLoading = false
              if (!isFromGenarateCode) {
                this.msgSuccess('保存成功');
                this.$emit('success')
              }
              resolve()
            }).catch(() => {
              this.saveLoading = false
              reject('保存接口报错')
            })
          } else {
            reject('表单校验不通过')
          }
        })
      })
    },
    genarateCode () {
      this.genarateLoading = true
      this.updateCodeMetadata(true).then(() => {
        this.genarateLoading = false
        if (this.genarateInfo.type === 'zip') {
          // zip下载
          downLoadZip("/app/table/zip/" + this.entityModelId)
          this.$emit('success')
        } else if (this.genarateInfo.type === 'path') {
          // 自定义路径下载
          this.genarateLoading = true
          genCode(this.entityModelId).then(() => {
            this.msgSuccess("成功生成到自定义路径：" + this.genarateInfo.path);
            this.$emit('success')
            this.genarateLoading = false
          }).catch(() => {
            this.genarateLoading = false
          })
        } else {
          console.error('下载方式不支持');
        }
      }).catch(err => {
        this.genarateLoading = false
        console.error(err)
      })
    },
    getTableRelations () {
      getTableRelations(this.entityModelId).then(res => {
        this.codes = res.data
        this.$nextTick(() => {
          if (this.genarateInfo.subTableId) {
            this.$refs.genInfo.setSubTableColumns(this.genarateInfo.subTableId)
          }
        })
      })
    }
  }
};
</script>
<style scoped>
.action-buttons {
  text-align: center;
}
</style>