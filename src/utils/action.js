// 全局Loading控制
export const changeToolboxLoading = payload => ({
  type: 'CHANGE_TOOLBOX_LOADING',
  payload
})
// 菜单图表高亮
export const changeMenu = payload => ({
  type: 'CHANGE_MENU',
  payload
})
// shift按下连选模式
export const changeShiftMultipleMode = payload => ({
  type: 'CHANGE_SHIFT_MULTIPLE_MODE',
  payload
})
// 获取用户信息
export const changeUser = payload => ({
  type: 'CHANGE_USER',
  payload
})