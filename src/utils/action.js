// 全局公共的manual codes初始化
export const classifyCodesInit = payload => ({
  type: 'CLASSIFY_CODES_INIT',
  payload
})
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
