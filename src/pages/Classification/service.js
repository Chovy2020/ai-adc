import { post,get } from '@/utils/api'

// DataQuery: itemsData
export const getItemsData = ({ pageNo, pageSize, data }) =>
  post(`manual/classify/page/filter/params/${pageNo}/${pageSize}`, data)

// Utilization: filters
export const getViewFilters = data => post('manual/gallery_image_classify_group', data)
// 获取图片列表 + 排序、过滤
export const getImages = data => post('manual/classify/page/images', data)

// Classified: codes
export const getClassifyCodes = () => post('classify/type/list')

// Classified: ok
export const updateClassification = data => post('manual/classify/update/info', data)

// Hotkeys: mappingList
export const getHotkeys = groupName => get(`adc-group/hotkey/list/group-name/${groupName}`)

//add to imageDB
export const addImageDB = (data) => post('image-db/add',data)