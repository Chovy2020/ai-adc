import { get } from '@/utils/api'
/**
 * 获取用户信息
 */
export const getUser = () => get('system/user/get/info/AIYEI_ADC')