<template>
  <parser v-if="formConf" :form-conf="formConf" :edit-data="editData" :showSubmit="false" />
</template>

<script>
import Parser from '@/components/CodeEditor/components/parser'
import { getTemplateDetail} from '@/api/dp/page/model.js'
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
      getTemplateDetail(8).then(res => {
        this.formConf = JSON.parse(res.data.pageMetadata)
      })
    }
  }
}
</script>