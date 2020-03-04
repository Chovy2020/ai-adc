// 每排显示几张图片
export const LAYOUT_SIZE = [3, 4, 5, 6]
// 字体大小
export const FONT_SIZE = ['12', '14', '16', '18']

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
// 分类列表
export const CATEGORY_TYPES = [
  ['Manual Bin', 'MB'],
  ['Rough Bin', 'RB'],
  ['ADC Bin', 'ADC']
]
// groups 列表
export const VIEW_GROUPS = [
  ['Manual Bin', 'MB'],
  ['Rough Bin', 'RB'],
  ['ADC Bin', 'ADC'],
  ['Lot Id', 'LotId'],
  ['Wafer Id', 'WaferId'],
  ['Step Id', 'StepId'],
  ['Product Id', 'ProductId'],
  ['scan time', 'ScanTime'],
  ['review time', 'ReviewTime']
]
// 图片上信息显示
export const getLotId = waferId => waferId.split('|')[0]
export const getWaferNo = waferId => waferId.split('|')[1]
export const getDefectId = waferId => waferId.split('|')[5]
export const getStepId = waferId => waferId.split('|')[3]
