export default {
  computed: {
    activeData: {
      get () {
        return this.$store.getters['codeEditor/components/getCurrentComponent']
      }
    }
  }
}
