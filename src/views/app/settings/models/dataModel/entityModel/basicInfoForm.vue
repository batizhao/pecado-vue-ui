<template>
  <el-form ref="basicInfoForm" :model="genarateInfo" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="表名称" prop="tableName">
          <el-input placeholder="请输入仓库名称" v-model="info.tableName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表描述" prop="tableComment">
          <el-input placeholder="请输入" v-model="info.tableComment" disabled />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="类名" prop="className">
          <el-input placeholder="请输入" v-model="genarateInfo.className" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="类作者" prop="classAuthor">
          <el-input placeholder="请输入" v-model="genarateInfo.classAuthor" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="类注释" prop="classComment">
          <span slot="label">
            类注释
            <el-tooltip content="用于类注解和菜单" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input placeholder="请输入" v-model="genarateInfo.classComment" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
export default {
  name: "BasicInfoForm",
  props: {
    info: {
      type: Object,
      default: null
    },
    genarateInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      rules: {
        className: [
          { required: true, message: "请输入实体类名称", trigger: "blur" }
        ],
        classAuthor: [
          { required: true, message: "请输入类作者", trigger: "blur" }
        ],
        classComment: [
          { required: true, message: "请输入类注释", trigger: "blur" }
        ]
      }
    };
  }
};
</script>
