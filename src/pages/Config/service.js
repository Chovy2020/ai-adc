import { post,get,put,del } from '@/utils/api'

/***
 * 获取 group 列表
 */
export const getGroups = () => post('adc-group/list')

/***
 * 获取 classCodes
 */
export const getClassCodes = () => post('manual-code/list')

/***
 * 根据 groupId 获取 hotkeys
 */
export const getHotkeys = (groupId) => get(`adc-group/hotkey/list?filter_EQ_groupId=${groupId}`)

 /***
  * 修改 hotkey
  */
 export const updateHotkeyList = (data) => post(`adc-group/hotkey/batch/insert`,data)
 
  /***
 * 新增 group 
 */
export const addGroup = (data) => post(`adc-group/insert`,data)

/***
 * 修改 group 
 */
export const updateGroup = (id,data) => put(`adc-group/update/${id}`,data)

/***
 * 删除 group
 */
export const deleteGroup = (ids) => del(`adc-group/delete/${ids}`);  
