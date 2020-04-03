import { get, post } from '@/utils/api'

export const countModelStatus = () => get('reporting/count/model-status')
export const countProduct = () => get('reporting/count/product')
export const shareLibrary = (data) => post('defect/library/share', data)

