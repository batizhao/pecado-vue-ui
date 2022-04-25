<template>
  <div>
    <el-form-item label="数据位置">
      <el-input
        v-model="activeData.__config__.dataPath"
        placeholder="请输入数据位置"
        @change="changeRenderKey"
      />
    </el-form-item>
    <el-form-item label="接口地址">
      <el-input
        v-model="activeData.__config__.url"
        :title="activeData.__config__.url"
        placeholder="请输入接口地址"
        clearable
        @change="changeRenderKey"
      >
        <el-select
          slot="prepend"
          v-model="activeData.__config__.method"
          style="width: 85px !important"
          @change="changeRenderKey"
        >
          <el-option label="get" value="get" />
          <!-- <el-option label="post" value="post" />
              <el-option label="put" value="put" />
              <el-option label="delete" value="delete" /> -->
        </el-select>
      </el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    activeData: Object
  },
  methods: {
    changeRenderKey () {
      this.$emit('changeRenderKey')
    }
  }
};
</script>
