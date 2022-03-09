export default {
  data () {
    return {
    }
  },
  props: {
    eventSettings: Object
  },
  methods: {
    click () {
      if (!this.eventSettings.emit) return
      this[this.eventSettings.emit]()
    },
    buttonEmitSubmit () {
      console.log("🚀 ~ file: mixins.js ~ line 15 ~ buttonEmitSubmit ~ buttonEmitSubmit")
    },
    buttonEmitSave () {
      console.log("🚀 ~ file: mixins.js ~ line 18 ~ buttonEmitSave ~ buttonEmitSave")

    }
  }
}
