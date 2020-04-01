import { get, post } from '@/utils/api'

// get library products, steps, grounps
export const getGroups = () => get('defect/library/params/group/list')
export const getProducts = (groupId) => get(`defect/library/params/product/list/${groupId}`)
export const getSteps = (groupId, productId) => get(`defect/library/params/step/list/${groupId}/${productId}`)
export const showLibrary = (data) => post('defect/library/show', data)
export const libraryUpdate = (data) => post('defect/library/update', data)
export const delLibraryImage = (data) => post('defect/library/image/delete', data)
// get defect products, steps, grounps
export const getDefectGroups = () => get('defect/params/group/list')
export const getDefectProducts = (groupId) => get(`defect/params/product/list/${groupId}`)
export const getDefectSteps = (groupId, productId) => get(`defect/params/step/list/${groupId}/${productId}`)
export const getDefectManualBin = (groupId, productId, stepId) => get(`defect/params/manual-bin/list/${groupId}/${productId}/${stepId}`)
export const getDefectImagesList = (groupId, productId, stepId, manualBin) => get(`defect/images/list/${groupId}/${productId}/${stepId}/${manualBin}`)
export const addImage = (data) => post('defect/library/image/add', data)
// add library
export const insertLibrary = (data) => post('defect/library/insert', data)


// /**
//  * @param {String} productId
//  * @param {String} stepId
//  */
// export const getParams = () => post('library/get_library', data)
// /**
//  * @param {String} productId
//  * @param {String} stepId
//  * @param {String} groupId
//  */
// export const getLibrary = () => post('library/get_library', data)

// /**
//  * @param {String} productId
//  * @param {String} stepId
//  * @param {String} groupId
//  */
// export const createLibrary = () => post('library/get_library', data)

// /**
//  * @param {String} libraryId
//  * @param {String} productId
//  * @param {String} stepId
//  * @param {String} groupId
//  */
// export const shareExist = () => post('library/get_library', data)

// /**
//  * @param {String} token
//  */
// export const getFolder = () => post('library/get_library', data)

// /**
//  * @param {String} libraryId
//  * @param {Array} imageIds
//  * @param {String} code
//  */
// export const addImages = () => post('library/get_library', data)

// /**
//  * @param {String} libraryId
//  * @param {Array} imageIds
//  */
// export const removeImages = () => post('library/get_library', data)

// /**
//  * @param {String} libraryId
//  * @param {String} code
//  * @param {String} Characterization
//  * @param {String} causeHypothesis
//  */
// export const editLibraryCodeInfo = () => post('library/get_library', data)