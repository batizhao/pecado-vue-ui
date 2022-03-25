<template>
  <parser v-if="formConf" :form-conf="formConf" :edit-data="editData" :showSubmit="false" />
</template>

<script>
import Parser from '@/components/CodeEditor/components/parser'
import { getPageModelBy} from '@/api/dp/page/model.js'
export default {
  name:'',
  components:{
    Parser
  },
  data(){
    return {
      formConf:null,
      mainConf:null,
      editData:{}
    }
  },
  created(){
    this.getFrame()
  },
  mounted(){},
  methods:{
    getFrame(){
      const params={
        type:'layout',
        status:"open"
      }
      getPageModelBy(params).then(res => {
        this.formConf = JSON.parse(res.data.pageMetadata)
        this.formConf.isForm = false
      })
    }
  }
}
</script>