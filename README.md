<h1 align="center"> hoc-element </h1>
<p align="center"> 📦 基于 element-ui 库的二次封装，该组件库主要针对现有列表页的 table 表格及 form 表单中的 rules 校验等场景，旨在减少重复的操作，让开发变得更简单。</p>

## Install

```shell
npm install hoc-element
```

## Quick Start

* 使用前请安装 [element-ui](https://www.npmjs.com/package/element-ui)

```js
import Vue from 'vue'
import HocElement from 'hoc-element'

Vue.use(HocElement)
```

## Components

```js
// 名字太长，待优化
HocElementTableList - 可配置的 Table
HocElementScrollAffix - 固钉
HocElementPreviewUploadSingle - 单张图片上传
HocElementPreviewUploadMultiple - 多张个图片上传
```

## Mixin

```
RulesForm - Form 表单规则
```

## Using

* 示例 `HocElementTableList`

```html
<template>
  <HocElementTableList
    title="产品列表"
    :paginationFilter="filterFormParams"
    :source="sourceList"
    :config="config"
    @getList="getList"
  >
  </HocElementTableList>
</template>
<script>
import XxxComponent from '@/components/XxxComponent'
export default {
  components: {
    XxxComponent,
  }
  computed: {
    ...mapGetters({
      sourceList: 'Xxxmodule/sourceList',
    })
  },
  methods: {
    copyLink () {},
    setForbidden () {},
    setUnForbidden () {},
    async getList (query = this.filterFormParams) {
      const res = await this.$store.dispatch(ProductLib.getAction('GetProductsList'), query)
      return res
    },
  }
  data () {
    return {
      loading: false,
      filterFormParams: { // 获取列表时传递的参数
        type: '',
        // ...
      },
      config: [
        {
          attrs: {
            label: '编号',
            prop: 'id',
            width: '90'
          }
        },
        {
          attrs: {
            label: '产品信息',
            width: '350'
          },
          renderComponent (data) {
            return [ // 必须为数组
              { name: 'XxxComponent', data } // 返回「组件名」和「组件需要的数据」(使用 v-model 来绑定 data)
            ]
          }
        },
        {
          attrs: {
            label: '最后更新人',
            width: '100',
            prop: 'lastModifierBy'
          }
        },
        {
          attrs: {
            label: '更新时间',
            prop: 'updatedAt'
          }
        },
        {
          attrs: {
            label: '操作',
            width: '260'
          },
          renderHTML (row) {
            return [
              {
                attrs: {
                  label: '编辑',
                  type: 'text',
                  size: 'medium'
                },
                el: 'button',
                click (row) {
                  this.$router.push(`/product_lib/products/${row.id}/edit/`)
                }
              },
              !row.isForbid ? {
                attrs: {
                  label: '禁用',
                  type: 'text',
                  size: 'medium'
                },
                el: 'button',
                click () {
                  this.setForbidden(row.id)
                }
              } : {
                attrs: {
                  label: '解除禁用',
                  type: 'text',
                  size: 'medium',
                  style: {
                    color: '#e6a23c'
                  }
                },
                el: 'button',
                click () {
                  this.setUnForbidden(row.id)
                }
              },
              {
                attrs: {
                  label: '复制链接',
                  type: 'text',
                  size: 'medium',
                  // 这里的指令来自 clipboard，只做为演示用，如有需要请自行安装
                  directives: [
                    {
                      name: 'clipboard',
                      value: `https://www.google.com`,
                      arg: 'copy'
                    }
                  ]
                },
                el: 'button',
                click () {
                  this.copyLink(row)
                }
              }
            ]
          }
        }
      ]
    }
  }
}
</script>

```

* 示例 `HocElementScrollAffix`

```html
<template>
  <HocElementScrollAffix>
    <div class="demo"></div>
  </HocElementScrollAffix>
</template>
<style lang="scss" scoped>
  .demo {
    position: absolute;
    width: 150px;
    height: 300px;
    border: 1px solid red;
  }
</style>

```

* 示例 `HocElementPreviewUploadSingle`

```html
<template>
  <HocElementPreviewUploadSingle
    action="your API"
    v-model="value"
  />
</template>
```

* 示例 `HocElementPreviewUploadMultiple`

```html
<template>
  <HocElementPreviewUploadMultiple
    action="your API"
    v-model="imageList"
  />
</template>
<script>
export default {
  data () {
    return {
      imageList: [
        { url: '' },
        { url: '' }
      ]
    }
  }
}
</script>
```

* 示例 `RuleForm`

```html
<template>
  <!-- code... -->
  <el-row :gutter="24">
    <el-col :span="24">
      <el-form-item
        label="标题"
        :prop="title"
        :rules="getRequiredRules('change')"
      >
        <el-input
          v-model="value.title"
          placeholder="请输入标题"
        />
      </el-form-item>
    </el-col>
  </el-row>
  <!-- code... -->
</template>
<!-- code... -->

```
## Dependencies

* Vue 2.5.17
* ElementUI 2.11.1
