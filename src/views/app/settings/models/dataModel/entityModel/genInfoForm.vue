<template>
  <el-form ref="genInfoForm" :model="info" :rules="rules" label-width="150px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="template">
          <span slot="label">生成模板</span>
          <el-select v-model="info.template" @change="tplSelectChange">
            <el-option label="单表" value="single" />
            <el-option label="树表" value="tree" />
            <el-option label="一对多表" value="onetomany" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="packageName">
          <span slot="label">
            生成包前缀
            <el-tooltip content="生成在哪个java包下，例如 me.batizhao，最后包名会加上模块名" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.packageName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="moduleName">
          <span slot="label">
            模块名
            <el-tooltip content="可理解为子系统名，例如 system" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.moduleName" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="mappingPath">
          <span slot="label">
            后端 API 路径
            <el-tooltip content="Controller RequestMapping" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.mappingPath" />
        </el-form-item>
      </el-col>      

      <el-col :span="12">
        <el-form-item prop="workflow">
          <span slot="label">
            整合工作流引擎
            <el-tooltip content="需要部署流程引擎平台" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-switch
            v-model="info.workflow"
            @change="workflowRadioChange"
            active-value="yes"
            inactive-value="no">
          </el-switch>
        </el-form-item>
      </el-col>

      <el-col :span="12" v-if="info.workflow == 'yes'">
        <el-form-item prop="workflowKey" :required="info.workflow == 'yes'" error="请输入流程Key">
          <span slot="label">
            流程Key
            <el-tooltip content="和流程平台绑定流程关键字" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.workflowKey" />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="testcase">
          <span slot="label">
            生成测试用例
            <el-tooltip content="1、已经引入依赖；2、测试基类已经存在；3、可能部分用例需要手动调整" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-switch
            v-model="info.testcase"
            active-value="yes"
            inactive-value="no">
          </el-switch>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            上级菜单
            <el-tooltip content="分配到指定菜单下，例如 系统管理" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <treeselect
            :append-to-body="true"
            v-model="info.parentMenuId"
            :options="menus"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="请选择系统菜单"
          />
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="type">
          <span slot="label">
            生成代码方式
            <el-tooltip content="默认为zip压缩包下载，也可以自定义生成路径" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-radio-group v-model="info.type" size="medium">
            <el-radio-button label="zip">zip下载</el-radio-button>
            <el-radio-button label="path">自定义路径</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" v-if="info.type == 'path'">
        <el-form-item prop="path">
          <span slot="label">
            后端项目路径
            <el-tooltip content="需要填写磁盘绝对路径，可以直接指向你的项目或者模块根路径。若不填写，则生成到当前Web项目下。" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-input v-model="info.path">
            <el-dropdown slot="append">
              <el-button type="primary">
                最近路径快速选择
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="info.path = '/'">恢复默认的生成基础路径</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>    

    <el-row v-show="info.template == 'onetomany'">
      <el-divider content-position="left">关联信息</el-divider>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            关联表名
            <el-tooltip content="关联子表的表名" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.subTableId" placeholder="请选择" @change="subSelectChange">
            <el-option
              v-for="(table, index) in tables"
              :key="index"
              :label="table.tableName + '：' + table.tableComment"
              :value="table.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <span slot="label">
            关联属性名
            <el-tooltip content="子表关联的属性名" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-select v-model="info.subTableFkName" placeholder="请选择">
            <el-option
              v-for="(column, index) in subColumns"
              :key="index"
              :label="column.name + '：' + column.comment"
              :value="column.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { entityModelDetail } from "@/api/app/dataModel.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "BasicInfoForm",
  components: { Treeselect },
  props: {
    info: {
      type: Object,
      default: null
    },
    tables: {
      type: Array,
      default: null
    },
    menus: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      subColumns: [],
      rules: {
        template: [
          { required: true, message: "请选择生成模板", trigger: "blur" }
        ],
        packageName: [
          { required: true, message: "请输入生成包路径", trigger: "blur" }
        ],
        moduleName: [
          { required: true, message: "请输入生成模块名", trigger: "blur" }
        ],
        mappingPath: [
          { required: true, message: "请输入后端 API 路径", trigger: "blur" }
        ],
        workflowKey: [
          { required: true, message: "请输入流程Key", trigger: "blur" }
        ],
      }
    };
  },
  created() {},
  watch: {
    'info.subTableId': function(val) {
      this.setSubTableColumns(val);
    }
  },
  methods: {
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 整合工作流引擎RadioChange */
    workflowRadioChange(val){
      if (val == "yes") {
        this.info.form = "visual"
      }
    },
    /** 选择子表名触发 */
    subSelectChange(value) {
      this.info.subTableFkName = '';
    },
    /** 选择生成模板触发 */
    tplSelectChange(value) {
      if(value !== 'onetomany') {
        this.info.subTableId = '';
        this.info.subTableFkName = '';
      }
    },
    /** 设置关联外键 */
    setSubTableColumns(value) {
      for (var item in this.tables) {
        const id = this.tables[item].id;
        if (value === id) {
          entityModelDetail(id).then(response => {
              this.subColumns = response.data.columnMetadata;
            }
          );
          break;
        }
      }
    }
  }
};
</script>
