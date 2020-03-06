import { post } from '@/utils/api'
/**
 * @param {String} productId
 * @param {String} stepId
 */
export const getParams = () => post('library/get_library', data)
/**
 * @param {String} productId
 * @param {String} stepId
 * @param {String} groupId
 */
export const getLibrary = () => post('library/get_library', data)

/**
 * @param {String} productId
 * @param {String} stepId
 * @param {String} groupId
 */
export const createLibrary = () => post('library/get_library', data)

/**
 * @param {String} libraryId
 * @param {String} productId
 * @param {String} stepId
 * @param {String} groupId
 */
export const shareExist = () => post('library/get_library', data)

/**
 * @param {String} token
 */
export const getFolder = () => post('library/get_library', data)

/**
 * @param {String} libraryId
 * @param {Array} imageIds
 */
export const addImages = () => post('library/get_library', data)

/**
 * @param {String} libraryId
 * @param {Array} imageIds
 */
export const removeImages = () => post('library/get_library', data)

/**
 * @param {String} libraryId
 * @param {String} code
 * @param {String} Characterization
 * @param {String} causeHypothesis
 */
export const editLibraryCodeInfo = () => post('library/get_library', data)