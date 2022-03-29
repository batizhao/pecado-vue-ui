<template>
  <div>
    <el-upload
      v-bind="$attrs"
      :data="params"
      :headers="headers"
      :file-list="fileList"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :disabled="newDisabled"
    >
      <slot></slot>
    </el-upload>
    <slot name="tip"></slot>
    <div @click="test" v-if="$isDevelopment">点击添加假数据</div>
  </div>
</template>

<script>
import { imageType } from '../../dictionary/index.js'
export default {
  inheritAttrs: false,
  props: {
    __config__: Object,
    defaultImageList: Array, // 针对轮播图组件、和图片组件，传入默认数据，就不需要通过接口去获取了
    isAuxiliary: Boolean, // 值为true时代表fileUpload组件是作为其他组件的辅助上传功能存在的，为false则代表是拖拽组件本身
    disabled: Boolean
  },
  data () {
    return {
      headers: {
        token: '123456'
      },
      fileList: [],
      uploadPrefix: process.env.VUE_APP_LOWCODEFILES
    }
  },
  created () {
    this.setDefaultData()
  },
  computed: {
    fieldName () {
      const { id, pageId } = this.$route.query
      return `${id}_${pageId}_${this.__config__.formId}`
    },
    fileSize () {
      return this.__config__.fileSize
    },
    params () {
      return {
        owner: this.fieldName, // appId + formId + fieldName
        limitSize: this.fileSize * 1024 * 1024, // 文件大小/
        type: imageType[this.$attrs.accept] || '无', // 文件分类
        remark: '' // 备注
      }
    },
    newDisabled () { // 在表单编辑页上传按钮没有默认值，直接禁用这个组件
      return (this.$route.path === '/form-editor' && !this.isAuxiliary) || this.disabled
    }
  },
  methods: {
    test () {
      this.handleSuccess({
        data: {
          id: '1486623730062004225',
          path: '/1483731569402425345_1486631105317748738_29219fd5/不限/20220127/1643276257845.png'
        }
      }, {
        name: '魁拔.png'
      })
    },
    setDefaultData () {
      if (this.isAuxiliary) {
        this.fileList = this.defaultImageList.map(item => {
          return {
            id: item.imageId,
            name: item.imageName,
            url: item.imageSrc
          }
        })
      }
    },
    // 设置defaultValue值
    setFileIds () {
      const ids = this.fileList.map(item => item.id)
      this.$emit('input', ids.toString())
    },
    handleSuccess (data, file) {
      const res = data.data
      this.fileList.push({
        name: file.name,
        url: this.uploadPrefix + res.path,
        id: res.id
      })
      this.setFileIds()
      this.$emit('change', this.fileList.map(item => ({
        name: item.name,
        url: item.url,
        id: item.id
      })))
    },
    handleError (err) {
      this.$message.error(String(err))
    },
    handleRemove (file) {
      if (!file.id) return
      const delIndex = this.fileList.findIndex(item => item.id === file.id)
      this.fileList.splice(delIndex, 1)
      this.setFileIds()
    },
    handleExceed () {
      this.$message.warning('已超过可上传的最大文件数')
    },
    beforeUpload (file) {
      const accept = this.$attrs.accept
      // 用file.type判断是否满足accpet值，如果不满足再用文件名后缀判断是否满足accept值
      if (accept) {
        if (accept.endsWith('/*')) {
          const reg = new RegExp(accept.replace('*', '.+'))
          if (!reg.test(file.type)) {
            this.$message.error('文件类型错误')
            return false
          }
        } else {
          const accepts = accept.split(',')
          const fileAppend = file.name.substr(file.name.lastIndexOf('.'))
          if (!accepts.includes(fileAppend)) {
            this.$message.error('文件类型错误')
            return false
          }
        }
      }
      const fileSize = file.size / 1024 / 1024 // 前端虽然可以设置上传大小，但是后端上传大小只能写死，所以目前限制了最大100M
      if (fileSize > this.fileSize) {
        this.$message.error(`文件大小不能超过 ${this.fileSize} MB`)
        return false
      }
      return true
    }
  }
}
</script>
