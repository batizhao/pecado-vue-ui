<template>
  <div>
    <el-divider :content-position="direction">{{ content }}</el-divider>
  </div>
</template>

<script>
export default {
  name: "split-line",
  props: {
    content: String,
    direction: String,
    createdCode: String,
    mountedCode: String,
  },
  created() {
    eval(this.createdCode);
  },
  mounted() {
    eval(this.mountedCode);
  },
};
</script>

<style lang="scss" scoped>
</style>