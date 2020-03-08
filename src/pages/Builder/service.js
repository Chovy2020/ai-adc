import { post } from '@/utils/api'
/**
 * 获取模型/模板 列表
 */
export const getModels = () => post('library/get_library')
/**
* 获取模型/模板 详情
* @param {Number} id 模板Id
*/
export const getModel = data => post('library/get_library', data)

/**
* 获取素材库 已存在的Defect Codes
*/
export const getCodes = data => post('library/get_library', data)
/**
* 获取素材库的图片（按code）
* @param {Number} codeId
*/
export const getCodeImages = data => post('library/get_library', data)

/**
* 添加图片
* @param {Array} imageIds
*/
export const addImagesToModel = data => post('library/get_library', data)
/**
* 删除图片
* @param {Array} imageIds
*/
export const removeImagesFromModel = data => post('library/get_library', data)

