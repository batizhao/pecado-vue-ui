<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
        <options></options>
      </form-basic-setting>
    </el-form>
  </div>
</template>

<script>
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
import options from './options/index.vue'
export default {
  mixins: [mixins],
  components: {
    formBasicSetting,
    options
  }
}
</script>
