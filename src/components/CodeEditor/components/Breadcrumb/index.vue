<template>
  <div>
    <el-breadcrumb v-bind="$attrs">
      <el-breadcrumb-item>工作台</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbNames"
        :key="index"
      >
        <a v-if="item.search && (index !== (breadcrumbNames.length - 1))" @click="jump(index, currentPath + item.search)">{{item.name}}</a>
        <template v-else>{{item.name}}</template>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'breadcrumb',
  data () {
    return {
      currentPath: this.$route.path
    }
  },
  computed: {
    breadcrumbNames () {
      return this.$store.state.codeEditor.breadcrumb.breadcrumbNames
    }
  },
  methods: {
    jump (index, url) {
      const breadcrumbNames = this.breadcrumbNames.slice(0, index + 1)
      this.$store.commit('codeEditor/breadcrumb/setBreadcrumbNames', breadcrumbNames)
      this.$router.replace({
        path: url
      })
    }
  }
}
</script>