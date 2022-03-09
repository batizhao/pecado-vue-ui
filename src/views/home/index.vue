<template>
  <parser v-if="formConf" :form-conf="formConf" :edit-data="editData" @submit="sumbitForm" :showSubmit="false" />
</template>

<script>
import Parser from '@/components/CodeEditor/components/parser'
import { getPageModelBy} from '@/api/dp/page/model.js'
import { deepClone } from '@/components/CodeEditor/utils/index'
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
        type:'index',
        status:"open"
      }
      let p1 = getPageModelBy(params)
      const params2={
        type:'main',
        status:"open"
      }
      let p2= getPageModelBy(params2)
      Promise.all([p1,p2]).then(res=>{
        const formConf = JSON.parse(res[0].data.pageMetadata)
        this.formConf = formConf
        const mainConf = JSON.parse(res[1].data.pageMetadata)
        console.log(mainConf)
        // this.formConf.fields[0].__config__.children = mainConf
        console.log(this.formConf)
      })
    },
    sumbitForm(){}
  }
}
</script>
<style lang="scss" scoped>
</style>
