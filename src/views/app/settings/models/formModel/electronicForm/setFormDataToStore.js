import { formConf } from '@/components/CodeEditor/components/generator/config.js'
import { mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations('codeEditor/components', ['setFormData', 'setFormConf', 'setDrawingList']),
    setFormDataToStore (res) {
      if (res) {
        const assemby = JSON.parse(JSON.stringify(res))
        this.setFormData(assemby)
        this.setDrawingList(assemby.fields)
        const assembyCopy = JSON.parse(JSON.stringify(assemby))
        delete assembyCopy.fields
        this.setFormConf(assembyCopy)
      } else {
        this.setFormData(null)
        this.setDrawingList([])
        this.setFormConf(formConf)
      }
    }
  }
}
