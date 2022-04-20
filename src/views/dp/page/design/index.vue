<template>
  <action-dialog
    v-model="visible"
    title="门户网站设计"
    :showFooter="false"
    fullscreen
    custom-class="web-design-dialog"
  >
    <div class="app-container" v-if="visible">
      <code-editor
        ref="refPortalSetting"
        :leftComponents="leftComponents"
        @save="saveCallBack"
      ></code-editor>
    </div>
  </action-dialog>
</template>

<script>
import codeEditor from '@/components/CodeEditor/views/index/Home.vue'
import { addOrEditTemplate} from '@/api/dp/page/model.js'
import { deepClone } from '@/components/CodeEditor/utils/index'
import setFormDataToStore from '../../../app/settings/models/formModel/electronicForm/setFormDataToStore.js'
export default {
  mixins: [setFormDataToStore],
  props: {
    modelData:{
      type:Object,
      default: () => ({})
    },
    leftComponents: Array
  },
  components: {
    codeEditor
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    open () {
      this.setFormDataToStore(this.modelData.pageMetadata)
      this.visible = true
    },
    close () {
      this.visible = false
    },
    save() {
      this.$refs.refPortalSetting.save()
    },
    saveCallBack(formData){
      const data = deepClone(this.modelData)
      data.pageMetadata = JSON.stringify(formData)
      addOrEditTemplate(data).then(() => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
        this.close()
        this.$emit('refresh')
      })
    }
  }
};
</script>
<style lang="scss">
.web-design-dialog>.el-dialog__body{
  padding: 0;
  border-top: 1px solid #f1e8e8;
  height: calc(100vh - 54px);
  .app-container{
    height: 100%;
    overflow: hidden;
    padding: 0;
  }
}
</style>