<template>
  <form-parse v-if="formConf" :form-conf="formConf" :showSubmit="false"></form-parse>
  <!-- form -- form-parse -- form-container -->
</template>

<script>
import { getPageModelBy} from '@/api/dp/page/model.js'
import FormParse from '@/components/CodeEditor/components/parser/FormParse.vue'
export default {
  components: { FormParse },
  data () {
    return {
      formConf: null
    }
  },
  created(){
    this.getFrame()
  },
  methods:{
    getFrame(){
      const params={
        type:'form',
        status:"open"
      }
      getPageModelBy(params).then(res => {
        this.formConf = JSON.parse(res.data.pageMetadata)
      })
    }
  }
}
</script>
