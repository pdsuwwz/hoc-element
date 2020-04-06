# HocElement

![npm](https://img.shields.io/npm/v/hoc-element)  ![NPM](https://img.shields.io/npm/l/hoc-element)

📦 基于 element-ui 库二次封装的一些高阶组件，该组件库主要解决 cms 等管理平台中繁琐的重复代码任务、通过一系列的配置化的思想将列表页的 table 表格及 form 表单中的 rules 校验等场景抽离了出来，旨在减少重复的操作，让开发变得更高效。


## Flexibility

* 通过配置化的方式生成 `table` 表格, 实现更高的自由度，无需再写大量的诸如 `<el-xxx>` 的模板
* 对于表单的 `validate rules`, 可直接绑定全局的对应规则函数，无需每次复制粘贴
* 针对图片 `upload`，只需两个参数 `API` 和 `v-model`，无需写一大堆参数
* 比较友好的 `affix`, 支持自定义高度悬停

## Environment Support

* Vue 2.5.17
* ElementUI 2.11.1

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
HocElTable - 可配置的 Table
HocElAffix - 固钉
HocElUploadSingle - 单张图片上传
HocElUploadMultiple - 多张个图片上传
```

## Mixin

```
RulesForm - Form 表单规则
```

## Using

* 示例 `HocElTable`

```html
<template>
  <div class="box-container">
    <div class="content">
      <hoc-el-table
        title="表格Demo"
        :source="sourceList"
        :config="config"
        :loading="loading"
        :border="border"
        :height="tableHeight"
        :action-list="[
          { text: '固定最右则列', action: () => setFixedRight() },
          { text: '固定表头', action: () => setFixedRow() },
          { text: '添加边框', action: () => setBorder() },
          { text: '居中表头label', action: () => setLabelCenter() }
        ]"
        @getList="getList"
      >
      </hoc-el-table>

    </div>
  </div>
</template>

<script>

import TableChildrenA from './table-children-a'
import TableChildrenB from './table-children-b'

export default {
  components: {
    TableChildrenA,
    TableChildrenB
  },
  methods: {
    sleep (time = 1000) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    async getList () {
      this.loading = true
      await this.sleep()
      this.loading = false
    },
    setFixedRight () {
      if (!this.fixedRight) {
        this.fixedRight = 'right'
      } else {
        this.fixedRight = false
      }
    },
    setFixedRow () {
      if (!this.tableHeight) {
        this.tableHeight = '350'
      } else {
        this.tableHeight = ''
      }
    },
    setLabelCenter () {
      if (!this.align) {
        this.align = 'center'
      } else {
        this.align = ''
      }
    },
    setBorder () {
      this.border = !this.border
    },
    setPublish (row) {
      this.$confirm(`此操作会将${row.name}发布到线上, 是否继续?`, `编号${row.id}提示`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '发布成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        })
      })
    },
    async setForbid (row) {
      this.loading = true
      await this.sleep()
      this.loading = false
      row.isForbid = !row.isForbid
    }
  },
  data () {
    return {
      loading: false,
      fixedRight: 'right',
      align: 'center',
      tableHeight: '350',
      border: false,
      sourceList: {}
    }
  },
  async created () {
    await this.getList()
    this.sourceList = this.mockData
  },
  computed: {
    mockData () {
      return {
        data: [
          { id: 0, name: '王小虎1', isForbid: false },
          { id: 1, name: '王小虎2', isForbid: false },
          { id: 2, name: '王小虎3', isForbid: false }
        ],
        meta: {
          pagination: {
            total: 3,
            count: 10,
            perPage: 10,
            currentPage: 1,
            totalPages: 1
          }
        }
      }
    },
    config () {
      const self = this
      const align = self.align
      return [
        {
          attrs: {
            label: '编号',
            align,
            prop: 'id'
          }
        },
        {
          attrs: {
            label: '名称',
            prop: 'name',
            align,
            width: 200
          }
        },
        {
          attrs: {
            label: '状态',
            prop: 'isForbid',
            align,
            width: 200
          },
          // 渲染字符串，默认不想展示 prop 的值，而是想对它做一些处理的时候，可以用这个方法
          render (isForbid) {
            return isForbid ? '✖️禁用中' : '✔️非禁用'
          }
        },
        {
          attrs: {
            label: '详情A',
            align,
            width: 400
          },
          // 渲染组件，返回值为一个数组， data 作为组件的 v-model，适用于需要展示复杂的数据的场景
          renderComponent (row) {
            return [
              { name: 'TableChildrenA', data: row }
            ]
          }
        },
        {
          attrs: {
            label: '详情B',
            align,
            width: 400
          },
          renderComponent (row) {
            return [
              { name: 'TableChildrenB', data: row }
            ]
          }
        },
        {
          attrs: {
            label: '操作',
            width: '260',
            align,
            fixed: self.fixedRight
          },
          // 渲染 el-button，一般用在最后一列。目前只支持 el-button 和 click 事件，后续会根据需求支持任意的 el-xxx 和事件委托
          renderHTML (row) {
            return [
              {
                attrs: {
                  label: '查看',
                  type: 'text',
                  size: 'medium'
                },
                el: 'button',
                click () {
                  this.$message(JSON.stringify(row))
                }
              },
              {
                attrs: {
                  label: '编辑',
                  type: 'text',
                  size: 'medium'
                },
                el: 'button',
                click () {
                  this.$message(`编号${row.id} router -> 已跳转到编辑页面！`)
                }
              },
              {
                attrs: {
                  label: '发布',
                  type: 'text',
                  size: 'medium'
                },
                el: 'button',
                click () {
                  this.setPublish(row)
                }
              },
              row.isForbid ? {
                attrs: {
                  label: '禁用',
                  type: 'text',
                  disabled: false,
                  size: 'medium'
                },
                el: 'button',
                click () {
                  this.setForbid(row)
                }
              } : {
                attrs: {
                  label: '解除禁用',
                  type: 'text',
                  disabled: false,
                  size: 'medium',
                  style: {
                    color: '#e6a23c'
                  }
                },
                el: 'button',
                click () {
                  this.setForbid(row)
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

<style>
* {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

<style lang="scss" scoped>
.box-container {
  .content {
    position: relative;
    padding: 20px 20px 0;
    margin: 0 auto;
  }
}
</style>

```

* 示例 `HocElAffix`

```html
<template>
  <div style="height: 200px; border: 1px solid #000;">占位</div>
  <hoc-el-affix
    :offsetTop="10"
  >
    <div class="demo"></div>
  </hoc-el-affix>
</template>
<style lang="scss" scoped>
.demo {
  width: 150px;
  height: 300px;
  border: 1px solid red;
}
</style>

```

* 示例 `HocElUploadSingle`

```html
<template>
  <hoc-el-upload-single
    action="your API"
    v-model="value"
  />
</template>
```

* 示例 `HocElUploadMultiple`

```html
<template>
  <hoc-el-upload-multiple
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
