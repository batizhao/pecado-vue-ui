<template>
  <div class="flow-chart" :body-style="{ position: 'relative' }">
    <div slot="header" class="">
      <span class="headerTitle">流程图</span>
    </div>
    <el-divider></el-divider>
    <BpmnViewer
      :checkDetail="false"
      v-if="bpmLoading"
      :row="flowChart"
      :xml="flowChart.xml"
    />
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
      bpmLoading: false,
      flowChart: {
        processInstanceId: "",
        xml: "",
        sourceType: "0",
      },
    };
  },
  mounted() {
    this.getLoginLogList();
  },
  methods: {
    getLoginLogList() {
      setTimeout(() => {
        if (this.$store.state.codeEditor.process.processConfig) {
          if (
            this.$store.state.codeEditor.process.processConfig.process ||
            this.$store.state.codeEditor.process.processConfig.task
          ) {
            this.flowChart.processInstanceId =
              this.$store.state.codeEditor.process.processConfig.process.dto.id;
            request({
              url: this.url,
              method: "get",
              params: {
                processDefId: this.flowChart.processInstanceId,
                sourceType: "0",
              },
            })
              .then((res) => {
                this.flowChart.xml = this.$Base64.decode(res.data);
                this.bpmLoading = true;
              })
              .catch(() => {
                this.bpmLoading = true;
              });
          }
        }
      }, 500);
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
