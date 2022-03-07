<template>
  <div class="contaner-full">
    <header-bar></header-bar>
    <div class="content">
        <nav-bar style="height:100%"></nav-bar>
        <div class="wrap">
          <div class="main"></div>
          <footer-bar></footer-bar>
        </div>

    </div>

  </div>
</template>

<script>
export default {
  name:'',
  components:{},
  props:{},
  data(){
    return {
    }
  },
  computed:{},
  created(){},
  mounted(){},
  methods:{},
  watch:{}
}
</script>
<style lang="scss" scoped>
.contaner-full{
  display: flex;
  flex-direction: column;
  height: 100%;
}

.content{
  display: flex;
  flex:1;

}
.wrap{
  display: flex;
  flex:1;
  height:100%;
  flex-direction: column;
}
.main{
  padding:20px;
  flex:1;
}
</style>
