<template>
  <div class="preview-uploader-multiple">
    <el-upload
      :action="action"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-progress="handleProgress"
      :on-error="handlerError"
      :before-upload="beforeAvatarUpload"
      multiple
    >
      <el-button
        v-if="!isDisabled"
        size="small"
        type="primary"
        :loading="loadingUpload"
      >上传多张</el-button>
    </el-upload>
    <div class="multiple-file-list">
      <div
        v-for="(file, index) in value"
        :key="index"
        class="file-item"
      >
        <PreviewUploadSingle
          v-model="file.url"
          :showTip="false"
          size="mini"
          :action="action"
        />
        <span
          v-if="!isDisabled"
          title="移除该图片"
          class="action-remove el-icon-delete"
          @click="handleRemove(index)"
        ></span>
      </div>
      <!-- 备选按钮，仅为添加下一张图而使用 -->
      <PreviewUploadSingle
        v-if="showAlternative"
        v-model="lastImage"
        :showTip="false"
        size="mini"
        :action="action"
        @onSuccess="handleSingleLastImage"
      />
    </div>
  </div>
</template>

<script>

import PreviewUploadSingle from '@/components/PreviewUploadSingle'
export default {
  name: 'UploadMultiple',
  inject: ['elForm'],
  components: {
    PreviewUploadSingle
  },
  props: {
    action: {
      type: String,
      required: true,
      default: ''
    },
    value: {
      type: Array,
      default () {
        return [
          { url: '' }
        ]
      }
    },
    showAlternative: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      lastImage: '',
      loadingUpload: false
    }
  },
  computed: {
    isDisabled () {
      return this.elForm.disabled
    },
    dragValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
        this.$emit('change', val)
        this.dispatch('ElFormItem', 'el.form.change', val)
      }
    }
  },
  methods: {
    handleSuccess (file) {
      const filterList = this.value.filter((fileItem) => fileItem.url)
      filterList.push(file)
      this.$emit('input', filterList)
      this.$emit('change', filterList)
      this.dispatch('ElFormItem', 'el.form.change', file.url)
      this.loadingUpload = false
    },
    handleRemove (index) {
      this.value.splice(index, 1)
    },
    handleSingleLastImage () {
      this.value.push({
        url: this.lastImage
      })
      this.lastImage = ''
    },
    handleProgress () {
      this.loadingUpload = true
    },
    handlerError (err, file) {
      if (err && err.status) {
        if (err.status === 429) {
          this.$message.error('您上传的频率太快啦，请先暂存或稍后再试 ~')
        } else {
          this.$message.error('上传失败！')
        }
      }
      this.loadingUpload = false
    },
    // 修复文件状态改变时 form 表单 rules 无法触发的 bug 【from element-ui mixins - emitter】
    dispatch (componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.componentName
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = /\/(?:jpeg|jpg|png|gif)/i.test(file.type)
      const isLt2M = file.size / 1024 / 1024 > 2
      let result = true
      if (!isJPG) {
        this.$message.error('请上传文件格式为 jpg/jpeg/png')
        result = false
      } else if (isLt2M) {
        this.$message.error('请上传大小不超过 2M 的 jpg/jpeg/png 图片文件')
        result = false
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-uploader-multiple {
  .multiple-file-list {
    .file-item {
      display: flex;
      align-items: center;
      .action-remove {
        cursor: pointer;
      }
    }
  }
}
</style>
