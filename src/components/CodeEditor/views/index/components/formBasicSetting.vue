<template>
  <div>
    <el-form-item v-if="activeData.__vModel__ !== undefined" label="字段名">
      <el-input
        v-model="activeData.__vModel__"
        placeholder="包含字母和数字，长度不超过30"
        @change="vModelChange"
      />
    </el-form-item>
    <el-form-item label="标签名">
      <el-input
        v-model="activeData.__config__.label"
        placeholder="请输入标签名"
      />
    </el-form-item>
    <el-form-item
      v-if="
        activeData.__config__.showLabel !== undefined
      "
      label="标签宽度"
    >
      <el-input-number
        v-model="activeData.__config__.labelWidth"
        placeholder="请输入"
        :disabled="!activeData.__config__.showLabel"
        :min="0"
        :max="1000"
        :step="25"
      />
    </el-form-item>
    <el-form-item
      v-if="
        activeData.__config__.showLabel !== undefined
      "
      label="显示标签"
    >
      <el-switch v-model="activeData.__config__.showLabel" />
    </el-form-item>
    <el-form-item v-if="activeData.__config__.required !== undefined" label="是否必填">
      <el-switch v-model="activeData.__config__.required" />
    </el-form-item>
    <el-form-item label="是否隐藏">
      <el-switch v-model="activeData.__config__.hidden" />
    </el-form-item>
    <el-form-item label="默认值"  v-if="activeData.__config__.defaultValue !== undefined">
        <el-input
          :value="setDefaultValue(activeData.__config__.defaultValue)"
          placeholder="请输入默认值"
          @input="onDefaultValueInput"
        />
      </el-form-item>
    <slot></slot>
    <function-setting></function-setting>
  </div>
</template>

<script>
import mixins from './mixins'
import functionSetting from './functionSetting.vue'
import { setDefaultValue, onDefaultValueInput } from './utils'
export default {
  mixins: [mixins],
  components: {
    functionSetting
  },
  created () {
    this.originVmodel = this.activeData.__vModel__
    const keywords = 'abstract,assert,boolean,break,byte,case,catch,char,class,const,continue,default,do,double,else,enum,extends,final,finally,float,for,goto,if,implements,import,instanceof,int,interface,long,native,new,package,private,protected,public,return,short,static,strictfp,super,switch,synchronized,this,throw,throws,transient,try,void,volatile,while'
    this.keywords = keywords.split(',')
  },
  methods: {
    setDefaultValue,
    onDefaultValueInput,
    vModelChange (val) {
      // 校验字符
      if (!/^[a-zA-Z0-9]{1,30}$/.test(val)) {
        this.errortip('字段名不符合要求：包含字母和数字，长度不超过30')
        return
      }
      // 校验是否与表单其他字段重复
      const checkName = list => {
        for (const item of list) {
          if ((item.__config__.formId !== this.activeData.__config__.formId) && (item.__vModel__ === val)) {
            this.errortip('字段名重复')
            return
          }
          item.children && item.children.length && checkName(item.children)
        }
      }
      checkName(this.$store.state.codeEditor.components.drawingList)
      // 校验是否是关键字
      if (this.keywords.includes(val)) {
        this.errortip('字段名为特殊关键字')
      }
    },
    errortip (text) {
      this.$message.error(text)
      this.activeData.__vModel__ = this.originVmodel
    }
  }
}
</script>
