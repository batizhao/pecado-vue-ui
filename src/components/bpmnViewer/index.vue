<template>
  <div class="bpmnViewer">
    <div style="position: absolute; left: 10px; top: 0; z-index: 999">
      <el-button
        icon="el-icon-remove"
        title="缩小视图"
        size="small"
        @click="processZoomOut()"
      ></el-button>
      <el-button size="small">{{
        Math.floor(defaultZoom * 10 * 10) + "%"
      }}</el-button>
      <el-button
        icon="el-icon-circle-plus"
        title="放大视图"
        size="small"
        @click="processZoomIn()"
      ></el-button>

      <el-button title="重置视图并居中" size="small" @click="processReZoom()">
        <img class="oneImg" src="~@/assets/images/one.png" alt="1:1" />
      </el-button>
    </div>

    <div ref="container" class="containers">
      <div
        id="bpmnCanvas2"
        ref="bpmnCanvas2"
        class="canvas"
        :style="{ width: 100 + '%', height: 100 + '%' }"
      ></div>
    </div>

    <div
      v-if="detailInfo"
      ref="flowMsgPopover2"
      class="flowMsgPopover2"
      :visible="true"
    >
      <div class="popover-box">
        <p class="popover-title">{{ detailInfo.name || "" }}</p>
        <div class="popover-con">
          <p>
            审批人员：
            <template v-if="detailInfo.approver">
              <!-- <el-tag v-for="item in detailInfo.approver.split(',')" :key="item" size="mini" color="processing" style="margin-right: 4px; margin-bottom: 4px;">{{item}}</el-tag> -->
              <span
                v-for="item in detailInfo.approver.split(',')"
                :key="item"
                class="detail-tag"
                size="mini"
                color="processing"
                style="margin-right: 4px; margin-bottom: 4px"
                >{{ item }}</span
              >
            </template>
          </p>
          <p>节点类型：{{ detailInfo.nodeType || "" }}</p>
          <p>节点状态：{{ detailInfo.status || "" }}</p>
          <p>开始时间：{{ detailInfo.startTime || "" }}</p>
          <p>结束时间：{{ detailInfo.endTime || "" }}</p>
          <p>审批耗时：{{ detailInfo.duration || "" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getHighLightedNodeVoByProcessDefidId} from "@/api/oa/task.js";
import BpmnViewer from "bpmn-js/lib/Viewer";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";

let bpmnViewer = null;
export default {
  // checkDetail 鼠标上移节点是否显示详情
  props: ["row", "xml", "checkDetail"],
  data() {
    return {
      highlightLine: [],
      highlightNode: [],
      nodeDetail: {},
      detailInfo: {},
      defaultZoom: 1,
    };
  },
  mounted() {
    this.init(null, this.row.processInstanceId,this.row.sourceType);
  },
  methods: {
    // 初始化
    async init(modelKey, processInstanceId, sourceType) {
      bpmnViewer && bpmnViewer.destroy();
      bpmnViewer = new BpmnViewer({
        container: document.getElementById("bpmnCanvas2"),
        width: "100%",
        additionalModules: [
          MoveCanvasModule, // 移动整个画布
        ],
      });

      if (processInstanceId) {
        getHighLightedNodeVoByProcessDefidId(processInstanceId,sourceType)
          .then((res) => {
            let result=this.$Base64.decode(res.data)
            // setModalProps({ title: '流程图 - ' + (res.modelName || '') })

            // this.highlightLine = result.highLightedFlows;

            // this.highlightNode = result.activeActivityIds;

            if (bpmnViewer) {
              this.importXml(result);
            } else {
              console.error("bpmnViewer is null or undefined!");
            }
          })
          .finally(() => {
            // changeLoading(false)
          });
      } else {
        if (bpmnViewer) {
          this.importXml(this.xml);
        } else {
          console.error("bpmnViewer is null or undefined!");
        }
      }
    },
    // 流程方法
    importXml(modelXml) {
      // 处理排他网关， 注：流程图预览时，排他网关需要在对应的<bpmndi:BPMNShape>节点上添加属性isMarkerVisible="true"
      const gatewayIds = this.getHtmlAttr(modelXml, "exclusiveGateway", "id");
      let modelXmlTemp = modelXml;
      if (gatewayIds && gatewayIds.length > 0) {
        gatewayIds.forEach((item) => {
          const result = new RegExp('id="(.+?)"').exec(item);
          if (result && result[1]) {
            modelXmlTemp = modelXmlTemp.replace(
              'bpmnElement="' + result[1] + '"',
              'bpmnElement="' + result[1] + '" isMarkerVisible="true"'
            );
          }
        });
      }
      bpmnViewer.importXML(modelXmlTemp, (err) => {
        if (err) {
          console.error(err);
        } else {
          this.importXmlSuccess();
        }
      });
    },
    getHtmlAttr(source, element, attr) {
      const result = [];
      const reg =
        "<" + element + "[^<>]*?\\s" + attr + "=['\"]?(.*?)['\"]?\\s.*?>";
      const matched = source.match(new RegExp(reg, "gi"));

      matched &&
        matched.forEach((item) => {
          item && result.push(item);
        });
      return result;
    },
    importXmlSuccess() {
      // 使流程图自适应屏幕
      const canvas = bpmnViewer.get("canvas");
      canvas.zoom("fit-viewport", "auto");
      if (this.row.processInstanceId) {
        this.setViewerStyle(canvas);
        if(this.checkDetail) {
          // this.bindEvents();
        }
      }
    },
    setViewerStyle(canvas) {
      if (this.highlightNode && this.highlightNode.length > 0) {
        this.highlightNode.forEach((item) => {
          canvas.addMarker(item, "highlight");
          const ele = document
            .querySelector(".highlight")
            .querySelector(".djs-visual rect");
          if (ele) {
            ele.setAttribute("stroke-dasharray", "4,4");
          }
        });
      }
      if (this.highlightLine && this.highlightLine.length > 0) {
        this.highlightLine.forEach((item) => {
          canvas.addMarker(item, "highlight-line");
        });
      }
    },
    // 以下代码为：为节点注册鼠标悬浮事件
    bindEvents() {
      const eventBus = bpmnViewer.get("eventBus");
      const overlays = bpmnViewer.get("overlays");
      eventBus.on("element.hover", (e) => {
        if (e.element.type === "bpmn:UserTask") {
          if (this.row.processInstanceId) {
            if (this.nodeDetail[e.element.id]) {
              this.genNodeDetailBox(this.nodeDetail[e.element.id], e, overlays);
            } else {
                getOneActivityVoByProcessInstanceIdAndActivityId(
                  this.row.processInstanceId,
                  e.element.id
                )
                .then((res) => {
                  if (res) {
                    this.nodeDetail[e.element.id] = res;
                    this.genNodeDetailBox(res, e, overlays);
                  }
                });
            }
          }
        }
      });
      eventBus.on("element.out", () => {
        overlays.clear();
      });
    },
    genNodeDetailBox(detail, e, overlays) {
      const tempDiv = document.createElement("div");
      this.detailInfo = detail;
      this.$nextTick(() => {
        const popoverEl = document.querySelector(".flowMsgPopover2");
        tempDiv.innerHTML = popoverEl.innerHTML;
        tempDiv.className = "tipBox";
        tempDiv.style.width = "200px";
        tempDiv.style.background = "rgba(255, 255, 255)";
        tempDiv.style.boxShadow = "0 0 8px grey";
        overlays.add(detail.id, {
          position: { top: e.element.height, left: 0 },
          html: tempDiv,
        });
      });
    },

    processZoomIn(zoomStep = 0.1) {
      const newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100;
      if (newZoom > 4) {
        throw new Error(
          "[Process Designer Warn ]: The zoom ratio cannot be greater than 4"
        );
      }
      this.defaultZoom = newZoom;
      bpmnViewer.get("canvas").zoom(this.defaultZoom);
    },
    processZoomOut(zoomStep = 0.1) {
      const newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100;
      if (newZoom < 0.2) {
        throw new Error(
          "[Process Designer Warn ]: The zoom ratio cannot be less than 0.2"
        );
      }
      this.defaultZoom = newZoom;
      bpmnViewer.get("canvas").zoom(this.defaultZoom);
    },
    processReZoom() {
      this.defaultZoom = 1;
      bpmnViewer.get("canvas").zoom("fit-viewport", "auto");
    },
  },
};
</script>
<style scoped>
.bpmnViewer{
  position: relative;
}
/deep/ .djs-container {
  overflow: visible !important;
}
/deep/ .el-tabs__content {
  overflow: visible !important;
}
/deep/ .el-input--default {
  position: unset;
}
</style>
<style lang="scss">
.bpmn-viewer-container {
  overflow: visible;
  .ant-modal {
    .ant-modal-content {
      .ant-modal-body {
        .scroll-container {
          overflow: visible;
        }
        .scrollbar__wrap {
          overflow: visible;
        }
      }
    }
  }
  #bpmnCanvas2 {
    .bjs-container {
      overflow: visible;
      .djs-container {
        overflow: visible !important;
      }
    }
  }
}
.bjs-powered-by {
  display: none;
}
.flowMsgPopover2 {
  display: none;
}
.highlight:not(.djs-connection) .djs-visual > :nth-child(1) {
  fill: rgba(251, 233, 209, 1) !important; /* color elements as green */
}
.highlight g.djs-visual > :nth-child(1) {
  stroke: rgba(214, 126, 125, 1) !important;
}
.highlight-line g.djs-visual > :nth-child(1) {
  stroke: rgba(0, 190, 0, 1) !important;
}
@-webkit-keyframes dynamicNode {
  to {
    stroke-dashoffset: 100%;
  }
}
.highlight {
  .djs-visual {
    -webkit-animation: dynamicnode 18s linear infinite;
    -webkit-animation-fill-mode: forwards;
  }
}
.tipBox {
  .ant-popover-arrow {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.flowMsgPopover2 {
  font-size: 14px;
}
.el-button + .el-button {
  margin-left: 0;
}
// 流程样式
.oneImg {
  width: 12px;
  height: 11px;
}
.popover-box {
  z-index: 9999999;
}
.detail-tag {
  display: inline-block;
  box-sizing: border-box;
  padding: 0 10px;
  border-width: 1px;
  border-style: solid;
  border-color: #d9ecff;
  border-radius: 4px;
  height: 23px;
  background-color: #ecf5ff;
  line-height: 23px;
  font-size: 12px !important;
  color: #409eff;
  white-space: nowrap;
}
p {
  // padding: 5px 10px;
  font-size: 12px;
}
.popover-title {
  padding: 5px 10px;
  border-bottom: 1px solid rgb(235, 229, 229);
  font-weight: bold;
}
.popover-con {
  padding: 10px;
}
.popover-con > p {
  padding: 2px 0;
}
.containers {
  width: 100%;
  height: 50vh;
  background-color: #fff;
  .canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
