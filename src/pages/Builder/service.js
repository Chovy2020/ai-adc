import { get, post, del } from '@/utils/api'
/**
 * 工具列表
 */
export const getStages = () => get('adc-builder/stage/list')
/**
 * 模型列表
 */
export const getModels = () => get('adc-model/list')
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
export const getModel = id => get(`adc-model/get/id/${id}`)
/**
 * 获取模型 详情(有图片的MB列表)
 * @param {Number} id 模型Id
 * * @param {String} code MB
 */
export const getModelImages = (id, code) => get(`adc-model/get/image/list/${id}/${code}`)

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
export const removeImagesFromModel = data => del('adc-model/image/remove', data)

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

// get defect products, steps, grounps
export const getDefectGroups = () => get('image-db/params/group/list')
export const getDefectProducts = (groupId) => get(`image-db/params/product/list/${groupId}`)
export const getDefectSteps = (groupId, productId) => get(`image-db/params/step/list/${groupId}/${productId}`)
export const getDefectManualBin = (groupId, productId, stepId) => get(`image-db/params/manual-bin/list/${groupId}/${productId}/${stepId}`)
export const getDefectImagesList = (groupId, productId, stepId, manualBin) => get(`image-db/images/list/${groupId}/${productId}/${stepId}/${manualBin}`)
