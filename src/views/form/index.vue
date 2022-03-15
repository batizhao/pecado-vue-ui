<template>
  <parser v-if="formConf" :form-conf="formConf" :showSubmit="false"></parser>
</template>

<script>
import { getPageModelBy} from '@/api/dp/page/model.js'
import Parser from '@/components/CodeEditor/components/parser/Parser.vue'
export default {
  components: { Parser },
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
