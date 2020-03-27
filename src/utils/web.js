import moment from 'moment'
// import _ from 'lodash'
import { MODULES } from '@/utils/constant'

// 延时
export const delay = timeout => new Promise(reslove => setTimeout(reslove, timeout))

// 互换
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// user => modules
export const generateModules = user => {
  if (!user || !user.buttons) return []
  const permissions = user.buttons
  let routes = []
  for (const s of permissions) {
    const perm = s.split(':')
    if (perm[2] === 'view' && !routes.includes(perm[1])) routes.push(perm[1])
  }
  routes = routes.map(r => `/${r}`)
  return MODULES.filter(p => routes.includes(p.link))
}

// 打印当前时间(微秒)
export const printTime = (sign = '') => {
  console.log(sign, `${moment(new Date()).second()}-${moment(new Date()).millisecond()}`)
}

// 转换成百分数 保留2位小数
export const toPercent = point => {
  let str = Number(point * 100).toFixed(2)
  str += '%'
  return str
}

// 随机生成颜色
export const getColor = str => {
  let hash = 1315423911
  for (let i = str.length - 1; i >= 0; i--) {
    const ch = str.charCodeAt(i)
    hash ^= (hash << 5) + ch + (hash >> 2)
  }
  return (hash & 0x7fffff).toString(16)
}

// 渐变色
export const gradientColors = (start, end, steps) => {
  let i,
    j,
    ms,
    me,
    output = [],
    so = []
  const normalize = channel => {
    return Math.pow(channel / 255, 1)
  }
  start = parseColor(start).map(normalize)
  end = parseColor(end).map(normalize)
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1)
    me = 1 - ms
    for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1) * 255).toString(16))
    }
    output.push('#' + so.join(''))
  }
  return output
}
const pad = s => {
  return s.length === 1 ? '0' + s : s
}
const parseColor = hexStr => {
  return hexStr.length === 4
    ? hexStr
        .substr(1)
        .split('')
        .map(function(s) {
          return 0x11 * parseInt(s, 16)
        })
    : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function(s) {
        return parseInt(s, 16)
      })
}
