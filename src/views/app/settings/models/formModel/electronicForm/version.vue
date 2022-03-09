<template>
  <div>
    <action-table
      ref="actionTableRef"
      :url="url"
      :columns="columns"
      :showPagination="false"
      :showSelection="false"
    >
      <template v-slot:action="scope">
        <action-button actionType="3" @click="handleView(scope.row)" icon="el-icon-view">查看</action-button>
        <action-button actionType="3" @click="handleRevert(scope.row)" icon="el-icon-check">恢复</action-button>
      </template>
    </action-table>

    <action-dialog
      v-model="formParserVisible"
      :title="'查看历史版本' + currentItem.version"
      :showFooter="false"
      fullscreen
    >
      <form-parser
        v-if="formParserVisible"
        :form-conf="currentItem.metadata.formData"
        :showSubmit="false"
      ></form-parser>
    </action-dialog>
  </div>
</template>

<script>
import formParser from '@/components/CodeEditor/components/parser/Parser.vue'
import { revertForm } from '@/api/app/formModel.js'
export default {
  props: {
    formKey: String
  },
  components: {
    formParser
  },
  data() {
    return {
      url: '/app/form/history/' + this.formKey,
      columns: [
        {
          label: '表单标识',
          prop: 'formKey'
        },
        {
          label: '表单元数据',
          prop: 'metadata'
        },
        {
          label: '版本',
          prop: 'version',
          width: '120px'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ],
      formParserVisible: false,
      currentItem: {}
    };
  },
  methods: {
    /** 查看按钮操作 */
    handleView(row) {
      const rowCopy = JSON.parse(JSON.stringify(row))
      rowCopy.metadata = JSON.parse(rowCopy.metadata)
      this.currentItem = rowCopy
      this.formParserVisible = true
    },
    /** 恢复按钮操作 */
    handleRevert(row) {
      const id = row.id;
      this.$confirm('确认恢复版本号为"' + row.version + '"的表单?', "警告", {
        type: "warning"
      }).then(() => {
        return revertForm(id);
      }).then(() => {
        this.msgSuccess("恢复成功");
        this.$refs.actionTableRef.getTableData()
      })
    }
  }
};
</script>
