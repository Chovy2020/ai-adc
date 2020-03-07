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
