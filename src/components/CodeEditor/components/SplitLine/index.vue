<template>
  <div>
    <el-divider :content-position="direction || 'center'">{{ content }}</el-divider>
  </div>
</template>

<script>
export default {
  name: "split-line",
  props: {
    content: String,
    direction: String,
  },
};
</script>

<style lang="scss" scoped>
</style>