import { post } from '@/utils/api'

// DataQuery: itemsData
export const getItemsData = data => post('manual/data_query', data)

// Utilization: filters
export const getViewFilters = data => post('manual/gallery_image_classify_group', data)
// 获取图片列表 + 排序、过滤
export const getImages = data => post('manual/upload_gallery_image/single', data)

// Classified: codes
export const getClassifyCodes = () => post('gallery_map/gallery_image_classify_list')

// Classified: ok
export const updateClassification = data => post('manual/gallery_image_classify', data)

// Hotkeys: mappingList
export const getHotkeys = data => post('manual/getHotkeys', data)
