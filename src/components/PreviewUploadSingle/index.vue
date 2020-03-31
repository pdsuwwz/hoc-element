<template>
  <el-upload
    class="preview-uploader-single"
    :class="{ 'forbidden': progress.show }"
    :action="action"
    :show-file-list="false"
    :on-success="handleSuccess"
    :on-progress="handleProgress"
    :before-upload="beforeAvatarUpload"
    :on-error="handlerError"
  >
    <div class="preview-cover-container">
      <div
        class="upload-progress"
        v-if="progress.show"
        :class="getSize"
      >
        <el-progress
          v-bind="getProgressAttr()"
          :class="getSize"
        />
      </div>
      <template v-if="value">
        <img
          :src="value"
          class="preview-cover-img"
          :class="getSize"
        >
        <span
          v-if="disabled"
          title="预览图片"
          class="action-preview-disabled"
          @click.stop
        >
          <span class="preview-icon el-icon-view"></span>
          <el-image
            class="hidden-preview"
            :src="value"
            :preview-src-list="[value]"
          />
        </span>
        <div
          v-if="!disabled && !progress.show"
          class="preview-hover-action"
        >
          <div class="action-list">
            <span
              title="预览图片"
              class="action-preview el-icon-view"
              @click.stop
            >
              <el-image
                class="hidden-preview"
                :src="value"
                :preview-src-list="[value]"
              />
            </span>
            <span
              v-if="clearable"
              title="清空图片"
              class="action-clear el-icon-delete"
              @click.stop="handleClear()"
            ></span>
          </div>
          <span class="action-replace">点击替换</span>
        </div>
      </template>
      <i
        v-else
        class="el-icon-plus begin-uploader-icon"
        :class="getSize"
      ></i>
    </div>
    <div
      v-if="showTip"
      slot="tip"
      class="el-upload__tip"
    >只能上传jpg/jpeg/png文件，且不超过2M</div>
  </el-upload>
</template>

<script>
export default {
  name: 'HocElementPreviewUploadSingle',
  inject: ['elForm'],
  props: {
    action: {
      type: String,
      required: true,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'default'
    },
    showTip: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      progress: {
        show: false,
        percent: 0,
        status: ''
      },
      disabled: this.elForm.disabled
    }
  },
  computed: {
    getSize () {
      const sizeList = ['large', 'default', 'small', 'mini']
      return sizeList.includes(this.size) ? this.size : 'default'
    }
  },
  methods: {
    async handleSuccess (res, file) {
      await this.hasCompletedForImage(res.url)
      this.progress.status = 'success'
      this.setPauseProgress()
      this.$emit('input', res.url)
      this.$emit('onSuccess', res.url)
      this.dispatch('ElFormItem', 'el.form.change', res.url)
    },
    handlerError (err, file) {
      if (err && err.status) {
        if (err.status === 429) {
          this.$message.error('您上传的频率太快啦，请先暂存或稍后再试 ~')
          this.setPauseProgress()
        } else {
          this.$message.error('上传失败！')
        }
      }
    },
    setPauseProgress () {
      setTimeout(() => {
        this.progress.show = false
        this.progress.percent = 0
        this.progress.status = ''
      }, 500)
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
    async handleProgress (event, file) {
      const percent = Math.floor(event.percent)
      this.progress.show = true
      this.progress.percent = percent
    },
    hasCompletedForImage (src) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          resolve(img)
        }
        img.onerror = () => {
          reject(new Error(''))
        }
        img.src = src
      })
    },
    handleClear () {
      this.$emit('input', '')
      this.dispatch('ElFormItem', 'el.form.change', '')
    },
    getProgressAttr () {
      const attr = {
        width: 100,
        type: 'circle',
        percentage: this.progress.percent
      }
      if (this.progress.status) {
        attr.status = this.progress.status
      }
      return attr
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
$sizeLarge: 260px;
$sizeDefault: 175px;
$sizeSmall: 130px;
$sizeMini: 80px;
@mixin sizeScale($size) {
  @if $size >= 130px {
    transform: translateX(-50%) translateY(-50%)
  } @else {
    transform: translateX(-50%) translateY(-50%) scale(0.65)
  }
}
@mixin sizeCover($size) {
  width: $size;
  height: $size;
  line-height: $size;
}
.preview-uploader-single {
  display: inline-block;
  margin-right: 26px;
  &.forbidden {
    pointer-events: none;
  }
  /deep/ .el-upload {
    position: relative;
    border-radius: 6px;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    vertical-align: text-top;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
  }
}
.preview-cover-container {
  position: relative;
  .preview-cover-img {
    display: block;
    object-fit: cover;
    @include sizeCover($sizeDefault);
    &.large {
      @include sizeCover($sizeLarge);
    }
    &.small {
      @include sizeCover($sizeSmall);
    }
    &.mini {
      @include sizeCover($sizeMini);
    }
  }
  &:hover {
    .preview-hover-action {
      opacity: 1;
    }
  }
  .action-preview-disabled {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: #fff;
    opacity: 0;
    transition: .3s;
    &:hover {
      opacity: 1;
      background-color: rgba($color: #000, $alpha: 0.5);
    }
    .preview-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);
      text-align: center;
      display: block;
      left: 50%;
      font-size: 27px;
    }
    .hidden-preview {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /deep/ .el-image__preview {
        opacity: 0;
      }
    }
  }
  .preview-hover-action {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000, $alpha: 0.5);
    color: #fff;
    transition: .3s;
    .action-list {
      position: absolute;
      right: 0;
      top: 0;
    }
    .action-preview, .action-clear {
      padding: 5px 5px 10px 10px;
      font-size: 1.2em;
      font-weight: bold;
    }
    .action-preview {
      .hidden-preview {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        /deep/ .el-image__preview {
          opacity: 0;
        }
      }
    }
    .action-replace {
      position: absolute;
      transform: translateY(-50%);
      top: 50%;
      left: 0;
      right: 0;
      font-size: 1em;
      font-weight: bold;
    }
  }
  .upload-progress {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000, $alpha: 0.5);
    /deep/ .el-progress {
      position: absolute;
      top: 50%;
      left: 50%;
      @include sizeScale($sizeDefault);
    }
    &.large {
      /deep/ .el-progress {
        @include sizeScale($sizeLarge);
      }
    }
    &.small {
      /deep/ .el-progress {
        @include sizeScale($sizeSmall);
      }
    }
    &.mini {
      /deep/ .el-progress {
        @include sizeScale($sizeMini);
      }
      /deep/ .el-progress__text {
        font-size: 20px !important;
      }
    }
    /deep/ .el-progress__text {
      color: #fff;
    }
  }
}
.begin-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  @include sizeCover($sizeDefault);
  &.large {
    @include sizeCover($sizeLarge);
  }
  &.small {
    @include sizeCover($sizeSmall);
  }
  &.mini {
    @include sizeCover($sizeMini);
  }
  text-align: center;
}
</style>
