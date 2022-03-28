<template>
  <div>
    <el-form size="small" label-width="90px">
      <el-divider>选项</el-divider>
      <el-form-item label="数据类型">
        <el-select
          v-model="activeData.remoteDataSettings.dataType"
          placeholder="请选择"
          @change="changeRenderKey"
        >
          <el-option label="动态数据" value="dynamic"></el-option>
          <el-option label="关联其他表单" value="bindMultipleForm"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="activeData.remoteDataSettings.dataType === 'dynamic'">
        <el-form-item label="接口地址">
          <el-input
            v-model="activeData.remoteDataSettings.url"
            :title="activeData.remoteDataSettings.url"
            placeholder="请输入接口地址"
            clearable
            @change="changeRenderKey"
          >
            <el-select
              slot="prepend"
              v-model="activeData.remoteDataSettings.method"
              style="width: 85px !important;"
              @change="changeRenderKey"
            >
              <el-option label="get" value="get" />
              <el-option label="post" value="post" />
              <el-option label="put" value="put" />
              <el-option label="delete" value="delete" />
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="数据位置">
          <el-input v-model="activeData.remoteDataSettings.dataPath" @change="changeRenderKey" />
        </el-form-item>
        <el-form-item label="rowKey">
          <el-input v-model="activeData.remoteDataSettings.rowKey" @change="changeRenderKey" />
        </el-form-item>
        <el-form-item label="树形表格">
          <el-switch v-model="isTreeTable" @change="isTreeTableChange" />
        </el-form-item>
        <el-form-item label="子级键名" v-show="isTreeTable">
          <el-input v-model="activeData.remoteDataSettings.children" @change="changeRenderKey" />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
import mixins from '../mixins'
import { mapMutations } from 'vuex'
export default {
  mixins: [mixins],
  data () {
    return {
      isTreeTable: true
    }
  },
  mounted () {
    this.isTreeTable = Boolean(this.activeData.remoteDataSettings.children)
  },
  methods: {
    ...mapMutations('codeEditor/components', ['changeRenderKey']),
    isTreeTableChange (val) {
      this.activeData.remoteDataSettings.children = val ? 'children' : ''
      this.changeRenderKey()
    }
  }
}
</script>
