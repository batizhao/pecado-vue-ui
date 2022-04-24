<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
        <el-form-item label="边框">
          <el-switch v-model="activeData.border"></el-switch>
        </el-form-item>
      </form-basic-setting>
    </el-form>
  </div>
</template>

<script>
import mixins from '../mixins'
import formBasicSetting from '../formBasicSetting.vue'
export default {
  mixins: [mixins],
  components: {
    formBasicSetting
  }
}
</script>
