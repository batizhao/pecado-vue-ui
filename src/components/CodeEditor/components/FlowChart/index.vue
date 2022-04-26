<template>
  <div class="flow-chart" :body-style="{ position: 'relative' }">
    <div slot="header" class="">
      <span class="headerTitle">流程图</span>
    </div>
    <el-divider></el-divider>
    <BpmnViewer :checkDetail="false" :row="flowChart" :xml="flowChart.xml" />
  </div>
</template>

<script>
import request from "@/utils/request";
import BpmnViewer from "@/components/bpmnViewer";
export default {
  name: "flow-chart",
  components: {
    BpmnViewer,
  },
  props: {
    url: String,
  },
  data() {
    return {
      flowChart: {
        processInstanceId: "ylgj_czfj:1:1587504",
        xml: "",
        sourceType: "0",
      },
    };
  },
  created() {
    this.getLoginLogList();
  },
  methods: {
    getLoginLogList() {
      request({
        url: this.url,
        method: "get",
        params: {
          processDefId: "ylgj_czfj:1:1587504",
          sourceType: "0",
        },
      }).then((res) => {
        this.flowChart.xml=this.$Base64.decode(res.data)
        console.log('this.flowChart.xml',this.flowChart.xml);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 10px 0;
}
.flow-chart {
  padding: 10px 0;
  border: 1px solid #e6e6e6;
  box-sizing: border-box;
  .headerTitle {
    margin-left: 10px;
    font-weight: 600;
  }
}
</style>
