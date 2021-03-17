<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="user.name" />
    </el-form-item> 
    <el-form-item label="手机号码" prop="mobileNumber">
      <el-input v-model="user.mobileNumber" maxlength="20" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="user.sex">
        <el-radio
          v-for="dict in sexOptions"
          :key="dict.value"
          :label="dict.value"
        >{{dict.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { addOrUpdateUser } from "@/api/ims/user";

export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 性别字典
      sexOptions: [],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobileNumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.listDictDataByCode("sex").then(response => {
      this.sexOptions = response.data;
    });
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addOrUpdateUser(this.user).then(response => {
            this.msgSuccess("保存成功");
          });
        }
      });
    }
  }
};
</script>
