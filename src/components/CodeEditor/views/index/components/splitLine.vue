<template>
  <div>
    <el-form size="small" label-width="90px">
      <form-basic-setting>
        <el-form-item label="文案内容">
          <el-input v-model="activeData.content" />
        </el-form-item>
        <el-form-item label="文字位置">
          <el-select
            v-model="activeData.direction"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in ['left', 'center', 'right']"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </form-basic-setting>
      <splitLine-Create></splitLine-Create>
    </el-form>
  </div>
</template>

<script>
import mixins from "./mixins";
import formBasicSetting from "./formBasicSetting.vue";
import splitLineCreate from "./splitLineCreate.vue";
export default {
  mixins: [mixins],
  components: {
    formBasicSetting,
    splitLineCreate,
  },
};
</script>
