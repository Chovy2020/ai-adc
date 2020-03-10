import { post } from '@/utils/api'
/**
 * 获取模型 列表
 */
export const getModels = () => post('library/get_library')
/**
 * 获取模板 列表
 */
export const getTemplates = () => post('library/get_library')
/**
 * 获取模型 详情(有图片的MB列表, Tools列表)
 * {
 *  codes: [],
 *  tools: []
 * }
 * @param {Number} id 模型Id
 */
export const getModel = data => post('library/get_library', data)
/**
 * 获取模型 详情(有图片的MB列表, Tools列表)
 * @param {Number} id 模型Id
 * @param {Number} code
 */
export const getModelImages = data => post('library/get_library', data)
/**
 * 获取模型 详情(MB对应的图片列表)
 * @param {Number} id 模型Id
 * @param {String} code MB
 */
export const getImages = data => post('library/get_library', data)
/**
 * 获取groupId 列表
 */
export const getGroups = () => post('library/get_library')
/**
 * 创建模型
 * @param {String} groupId
 * @param {String} modelName 模型name
 */
export const createModel = () => post('library/get_library')

/**
 * 获取素材库文件夹
 */
export const getFolders = data => post('library/get_library', data)
/**
 * 获取素材库的图片（按code）
 * @param {Number} groupId
 * @param {Number} prodAndStep
 * @param {String} code
 */
export const getCodeImages = data => post('library/get_library', data)
/**
 * 添加图片
 * @param {Number} id 模型Id
 * @param {Array} imageIds
 * @param {String} code
 */
export const addImagesToModel = data => post('library/get_library', data)
/**
 * 删除图片
 * @param {Number} id 模型Id
 * @param {Array} imageIds
 * @param {String} code
 */
export const removeImagesFromModel = data => post('library/get_library', data)


/**
 * 更新Model tools
 * @param {Number} id 模型Id
 * @param {Object} tools
 */
export const updateModelTools = data => post('library/get_library', data)
/**
 * 获取toolsList
 */
export const getModelTools = data => post('library/get_library', data)