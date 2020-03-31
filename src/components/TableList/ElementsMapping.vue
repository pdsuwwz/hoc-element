<template>
  <div>
    <component
      v-for="(item, index) in getCellList"
      :key="index"
      :is="elementsMapping[item.el]"
      v-bind="getAttrsValue(item)"
      @click="item.click.call(parent, row)"
    >{{ item.attrs.label }}</component>
  </div>
</template>

<script>
export default {
  props: {
    parent: {
      type: Object,
      dafault () {
        return {}
      }
    },
    row: {
      type: Object,
      dafault () {
        return {}
      }
    },
    cellList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      elementsMapping: {
        button: 'el-button'
      }
    }
  },
  computed: {
    getCellList () {
      return this.cellList.filter((cell) => cell && Object.keys(cell).length)
    }
  },
  methods: {
    getAttrsValue (item) {
      return {
        ...item.attrs
      }
    }
  }
}
</script>
