<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
      <el-form-item label="接口地址">
        <el-input v-model="activeData.url" />
      </el-form-item>
      </form-basic-setting>
    </el-form>
  </div>
</template>

<script>
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
export default {
  mixins: [mixins],
  components: {
    formBasicSetting
  }
}
</script>
