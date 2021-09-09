<template>
  <div>
    <div class="panel-title">意见</div>
    <el-input
      class="suggestion"
      type="textarea"
      v-model="suggestion"
    ></el-input>
    <div class="panel-title">下一处理节点</div>
    <i class="el-icon-loading" v-if="nodeListLoading"></i>
    <el-checkbox-group v-model="nodeCheckList" v-else>
      <el-checkbox v-for="item in nodeList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-divider></el-divider>
    <div class="panel-title">下一处理人</div>
    <i class="el-icon-loading" v-if="peopelListLoading"></i>
    <el-checkbox-group v-model="peopelCheckList" @change="peopleChange" v-else>
      <el-checkbox v-for="item in peopelList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-divider></el-divider>
    <div class="panel-title">
      送相关部门对接人会签环节接收人:<span class="people-name">{{ recieveName }}</span>
    </div>
    <el-divider></el-divider>
    <div class="panel-title">发送短信通知</div>
    <el-radio-group v-model="sendMsgRadioVal">
      <el-radio :label="1">是</el-radio>
      <el-radio :label="0">否</el-radio>
    </el-radio-group>
  </div>
</template>
<script>
import { getProcessRouter } from "@/api/oa/task";
import { listLeader } from "@/api/ims/user";
export default {
  name: "examine-dialog",
  data() {
    return {
      suggestion: "",
      sendMsgRadioVal: null,
      nodeCheckList: [],
      peopelCheckList: [],
      recieveName: "", //送相关部门对接人会签环节接收人
      nodeList: [],
      peopelList: [],
      postData: {},
      peopelListLoading: false,
      nodeListLoading: false
    };
  },
  created() {},
  methods: {
    peopleChange(val) {
      console.log(val);
      this.recieveName = "";
      val.forEach((valItem, index) => {
        const peopleObj = this.peopelList.find(item => {
          return item.id == valItem;
        });
        if (peopleObj) {
          if (index == 0) {
            this.recieveName = peopleObj.name;
          } else {
            this.recieveName += "，" + peopleObj.name;
          }
        }
      });
    },
    show(postData) {
      this.nodeListLoading = true;
      this.peopelListLoading = true;
      getProcessRouter(postData.processDefinitionId, postData.taskDefKey)
        .then(res => {
          this.nodeList = res.data || [];
          this.nodeListLoading = false;
          listLeader().then(leaderRes => {
            this.peopelList = leaderRes.data || [];
            this.peopelListLoading = false;
          });
        })
        .catch(err => {
          console.log(err);
          this.nodeListLoading = false;
          this.peopelListLoading = false;
        });
    },
    getExamineData() {
      console.log("getExamineData");
      console.log(this.nodeCheckList);
      console.log(this.peopelCheckList);
      return new Promise((resolve, reject) => {
        if (this.nodeCheckList.length == 0) {
          reject("请勾选下一处理节点");
          return;
        }
        // if (this.peopelCheckList.length == 0) {
        //   reject("下一处理人");
        //   return
        // }
        let processNodeDTO = [];
        this.nodeCheckList.forEach(nodeCheckItem => {
          const nodeObj = this.nodeList.find(nodeItem => {
            return nodeItem.id == nodeCheckItem;
          });
          if (nodeObj) {
            const processNode = {};
            let { name, node } = nodeObj;
            processNode.flowName = name;
            processNode.operType = 0;
            processNode.paramType = 0;
            processNode.target = node.id;
            processNode.targetName = node.name;
            let candidate = [];
            this.peopelCheckList.forEach(peopelCheckItem => {
              const peopleObj = this.peopelList.find(peopelItem => {
                return peopelItem.id == peopelCheckItem;
              });
              if (peopleObj) {
                const candidateObj = {};
                candidateObj.orgId = 0;
                candidateObj.userId = peopleObj.id;
                candidateObj.userName = peopleObj.name;
                candidate.push(candidateObj);
              }
            });
            processNode.candidate = candidate;
            processNodeDTO.push(processNode);
          }
        });
        resolve({
          processNodeDTO,
          suggestion: this.suggestion
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.top-panel {
  width: 100%;
  height: 50px;
  background-color: #d6eafc;
  text-align: center;
}
.suggestion {
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 10px;
  width: 100%;
}
.form {
  margin-top: 20px;
  padding-left: 50px;
  padding-right: 50px;
}
.form-bottom {
  text-align: center;
}
.pl20 {
  padding-left: 20px;
}
.panel-title {
  padding-left: 10px;
  padding-bottom: 10px;
  font-weight: bold;
  font-size: 15px;
  .people-name {
    padding-left: 10px;
    font-weight: normal;
    color: red;
  }
}
</style>
