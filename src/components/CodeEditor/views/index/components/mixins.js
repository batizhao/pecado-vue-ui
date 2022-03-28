export default {
  computed: {
    activeData: {
      get () {
        return this.$store.getters['codeEditor/components/getCurrentComponent']
      },
      set (value) {
        this.$store.commit('codeEditor.components.setActiveComponent', value)
      }
    }
  }
}
