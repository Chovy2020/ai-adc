// 每排显示几张图片
export const LAYOUT_SIZE = [3, 4, 5, 6]
// 字体大小
export const FONT_SIZE = ['12', '14', '16', '18']
// 拖拽框列表
export const ITEMS_LIST = [
  'Product Id',
  'Step Id',
  'Lot Id',
  'Wafer Id',
  'Scan Time/Date',
  'Inspect Equip Id',
  'Recipe Id',
  'Test Id',
  'Slot Id',
  'Group Id'
]
// 拖拽框对应数据库字段
export const ITEMS_MAPPING = {
  'Product Id': 'PRODUCT_ID',
  'Step Id': 'STEP_ID',
  'Lot Id': 'LOT_ID',
  'Wafer Id': 'WAFER_NO',
  'Scan Time/Date': 'SCAN_TM',
  'Inspect Equip Id': 'EQP_ID',
  'Recipe Id': 'RECIPE_ID',
  'Test Id': 'TEST_NO',
  'Slot Id': 'SLOT_NUM',
  'Group Id': 'GROUP_ID'
}
// 拖拽框对应接口字段
export const ITEMS_MAPPING_2 = {
  'Product Id': 'productIds',
  'Step Id': 'stepIds',
  'Lot Id': 'lotIds',
  'Wafer Id': 'waferIds',
  'Inspect Equip Id': 'inspectors',
  'Recipe Id': 'recipeIds',
  'Scan Time/Date': 'scanDates',
  'Test Id': 'testIds',
  'Slot Id': 'sLotIds',
  'Group Id': 'groupIds'
}
// 分类列表
export const CATEGORY_TYPES = [
  ['Manual Bin', 'MB'],
  ['Rough Bin', 'RB'],
  ['ADC Bin', 'ADC']
]
// groups 列表
export const VIEW_GROUPS = [
  ['Manual Bin', 'MAN_BIN'],
  ['Rough Bin', 'ROUGH_BIN'],
  ['ADC Bin', 'ADC_BIN'],
  ['Lot Id', 'LOT_ID'],
  ['Wafer Id', 'WAFER_NO'],
  ['Step Id', 'STEP_ID'],
  ['Product Id', 'PRODUCT_ID'],
  ['scan time', 'SCAN_TM'],
  ['review time', 'REVIEW_TM']
]
// 图片上信息显示
export const getLotId = waferId => waferId.split('|')[0]
export const getWaferNo = waferId => waferId.split('|')[1]
export const getDefectId = waferId => waferId.split('|')[5]
export const getStepId = waferId => waferId.split('|')[3]
