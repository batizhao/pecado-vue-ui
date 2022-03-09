<template>
  <el-dialog fullscreen :visible.sync="visible" :show-close="false" v-if="visible">
    <span slot="title" class="d-head">
      <span>门户网站设计</span>
      <span class="d-action">
        <el-button type="primary" @click="save()" size="small">保 存</el-button>
        <el-button @click="show()" size="small">预览</el-button>
        <el-button @click="empty()" size="small">清 空</el-button>
        <el-button @click="close()" size="small">取 消</el-button>
      </span>
    </span>
    <PortalSetting
      ref="refPortalSetting"
      :pageData="modelData.pageMetadata"
      :leftComponents="leftComponents"
      @save="saveCallBack"
    />
  </el-dialog>
</template>

<script>
import PortalSetting from '@/components/CodeEditor/views/index/PortalSetting'
import { addOrEditTemplate} from '@/api/dp/page/model.js'
import { deepClone } from '@/components/CodeEditor/utils/index'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modelData:{
      type:Object,
      default:_=>{
        return {
        }
      }
    },
    leftComponents: Array
  },
  components: {
    PortalSetting
  },
  data() {
    return {
    };
  },
  methods: {

    save() {
      this.$refs.refPortalSetting.save()
    },
    saveCallBack(pageMetadata){
      const data = deepClone(this.modelData)
      data.pageMetadata = JSON.stringify(pageMetadata)
      addOrEditTemplate(data).then(() => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
        this.close()
        this.$emit('refresh')
      })
    },
    show() {
      this.close();
    },
    empty() {
      this.$refs.refPortalSetting.empty()
		},
    cancel() {
      this.close();
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="scss" scoped>
.d-head {
  display: flex;
  justify-content: space-between;
}
.wrap {
  display: flex;
  height: 100%;
  border-top: 2px solid #ccc;
}
.component-list {
  height: 100%;
  width: 200px;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  .components-item {
    position: relative;
    margin: 5px 0;
    padding: 0 10px;
    background: #f4f6fc;
    line-height: 30px;
    cursor: pointer;
    font-size: 12px;
    color: #1890ff;
  }
}
.drag-wrap {
  padding: 20px;
  flex: 1;
  background: #f0f2f5;
  overflow-y: auto;
}
::v-deep .el-dialog__body {
  padding: 0;
  height: 100%;
}
.drawing-board {
  position: relative;
  height: 100%;
  .components-body {
    margin: 0;
    padding: 0;
    font-size: 0;
  }
}
</style>
