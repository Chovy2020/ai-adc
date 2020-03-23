import { get, post } from '@/utils/api'
/**
 * 获取模型 列表
 */
export const login = data => post('auth/login', data)
/**
 * 获取用户信息
 */
export const getUser = () => get('system/user/get/info/AIYEI_ADC')