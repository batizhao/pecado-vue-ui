<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting></form-basic-setting>
      <el-form-item label="组件高度">
        <el-input-number v-model="activeData.height"  @input="changeRenderKey" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import formBasicSetting from './formBasicSetting.vue'
import mixins from './mixins'
import { mapMutations } from 'vuex'
export default {
  components: {
    formBasicSetting
  },
  mixins: [mixins],
  methods: {
    ...mapMutations('codeEditor/components', ['changeRenderKey']),
  }
}
</script>
