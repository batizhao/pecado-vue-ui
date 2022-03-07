<template>
  <el-dialog fullscreen :visible.sync="visible" :show-close="false">
    <span slot="title" class="d-head">
      <span>门户网站设计</span>
      <span class="d-action">
        <el-button type="primary" @click="save()" size="small">保 存</el-button>
        <el-button @click="show()" size="small">预览</el-button>
        <el-button @click="empty()" size="small">清 空</el-button>
        <el-button @click="close()" size="small">取 消</el-button>
      </span>
    </span>
    <div class="wrap">
      <div class="component-list">
        <draggable
          class="components-draggable"
          :list="componentList"
          :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
          :clone="cloneComponent"
          draggable=".components-item"
          :sort="false"
          @end="onEnd"
        >
          <div
            class="components-item"
            v-for="(item, index) in componentList"
            :key="index"
            @click="addComponent(item)"
          >
            {{ item.__config__.label }}
          </div>
        </draggable>
      </div>
      <div class="drag-wrap">
        <draggable
          class="drawing-board"
          :list="drawingList"
          :animation="340"
          group="componentsGroup"
        >
          <draggable-item
            v-for="(item, index) in drawingList"
            :key="item.renderKey"
            :drawing-list="drawingList"
            :current-item="item"
            :index="index"
            :active-id="activeId"
            :form-conf="formConf"
            @activeItem="activeFormItem"
            @copyItem="drawingItemCopy"
            @deleteItem="drawingItemDelete"
          />
        </draggable>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import draggable from "vuedraggable";
import DraggableItem from "@/components/CodeEditor/views/index/DraggableItem";
import {componentList, formConf} from "./componentList";

import { deepClone } from "@/components/CodeEditor/utils/index";
import { mkrandomstr } from "@/utils/index";
import {getDrawingList, saveDrawingList, getIdGlobal, saveIdGlobal, getFormConf} from '@/components/CodeEditor/utils/db'
let tempActiveData;
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    draggable,
    DraggableItem
  },
  data() {
    return {
      componentList: componentList,
      drawingList: [],
      activeData: null,
      activeId:null
    };
  },
  mounted(){
    // this.activeFormItem(this.drawingList[0])
  },
  methods: {
    activeFormItem(currentItem) {
			this.activeData = currentItem
			this.activeId = currentItem.__config__.formId
		},
    drawingItemCopy(item, list) {
			let clone = deepClone(item)
			clone = this.createIdAndKey(clone)
			list.push(clone)
			this.activeFormItem(clone)
		},
    drawingItemDelete(index, list) {
			list.splice(index, 1)
			this.$nextTick(() => {
				const len = this.drawingList.length
				if (len) {
					this.activeFormItem(this.drawingList[len - 1])
				}
			})
		},
    empty() {
			this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
				() => {
					this.drawingList = []
					this.idGlobal = Math.floor(Math.random() * 10000)
				}
			)
		},
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData;
      }
    },
    addComponent(item) {
      console.log("addComponent");
      // const clone = this.cloneComponent(item)
      // this.fetchData(clone)
      // this.drawingList.push(clone)
      // this.activeFormItem(clone)
    },
    cloneComponent(origin) {
      const clone = deepClone(origin);

      clone.renderKey = mkrandomstr(6);

      // // const config = clone.__config__;
      tempActiveData = clone;
      return tempActiveData;
      // const clone = deepClone(origin)
      // const config = clone.__config__
      // config.span = this.formConf.span // 生成代码时，会根据span做精简判断
      // this.createIdAndKey(clone)
      // clone.placeholder !== undefined && (clone.placeholder += config.label)
      // tempActiveData = clone
      // return tempActiveData
    },
    save() {
      this.close();
    },
    show() {
      this.close();
    },
    empty() {},
    cancel() {
      this.close();
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="scss" scoped>
.d-head {
  display: flex;
  justify-content: space-between;
}
.wrap {
  display: flex;
  height: 100%;
  border-top: 2px solid #ccc;
}
.component-list {
  height: 100%;
  width: 200px;
  overflow-y: auto;
  padding: 10px;
  box-sizing: border-box;
  .components-item {
    position: relative;
    margin: 5px 0;
    padding: 0 10px;
    background: #f4f6fc;
    line-height: 30px;
    cursor: pointer;
    font-size: 12px;
    color: #1890ff;
  }
}
.drag-wrap {
  padding: 20px;
  flex: 1;
  background: #f0f2f5;
  overflow-y: auto;
}
::v-deep .el-dialog__body {
  padding: 0;
  height: 100%;
}
.drawing-board {
  position: relative;
  height: 100%;
  .components-body {
    margin: 0;
    padding: 0;
    font-size: 0;
  }
}
</style>
