import Mixin from './mixins'
import HocElTableList from './components/TableList'
import HocElScrollAffix from './components/ScrollAffix'
import HocElPreviewUploadSingle from './components/PreviewUploadSingle'
import HocElPreviewUploadMultiple from './components/PreviewUploadMultiple'

const components = [
  HocElTableList,
  HocElScrollAffix,
  HocElPreviewUploadSingle,
  HocElPreviewUploadMultiple
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(`HocEl${component.name}`, component)
  })
  Vue.mixin(Mixin)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: '0.2.1',
  install,
  ...components
}
