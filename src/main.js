import Mixin from './mixins'
import HocElementTableList from './components/TableList'
import HocElementScrollAffix from './components/ScrollAffix'
import HocElementPreviewUploadSingle from './components/PreviewUploadSingle'
import HocElementPreviewUploadMultiple from './components/PreviewUploadMultiple'

const components = [
  HocElementTableList,
  HocElementScrollAffix,
  HocElementPreviewUploadSingle,
  HocElementPreviewUploadMultiple
]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  Vue.mixin(Mixin)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: '0.0.2',
  install,
  ...components
}
