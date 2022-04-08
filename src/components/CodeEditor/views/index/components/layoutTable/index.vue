<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
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
