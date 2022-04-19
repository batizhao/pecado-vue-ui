<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
      <el-form-item label="分隔符">
        <el-input v-model="activeData.separator" @change="changeRenderKey"/>
      </el-form-item>
      </form-basic-setting>
    </el-form>
  </div>
</template>

<script>
import mixins from './mixins'
import formBasicSetting from './formBasicSetting.vue'
import { mapMutations } from 'vuex'
export default {
  mixins: [mixins],
  components: {
    formBasicSetting
  },
  methods: {
    ...mapMutations('codeEditor/components', ['changeRenderKey']),
  }
}
</script>
