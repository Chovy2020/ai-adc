import axios from 'axios'
import { message } from 'antd'
import { delay } from '@/utils/web'
import store from '@/utils/store'

const instance = axios.create({
  baseURL: '/system/',
  timeout: 30000,
  withCredentials: true
})

// 错误代码
const HTTP_ERROR_CODE = {
  400: '请求错误(400)',
  401: '未授权，请重新登录(401)',
  403: '拒绝访问(403)',
  404: '请求出错(404)',
  406: '请求参数错误(406)',
  408: '请求超时(408)',
  500: '服务器错误(500)',
  501: '服务未实现(501)',
  502: '网络错误(502)',
  503: '服务不可用(503)',
  504: '网络超时(504)',
  505: 'HTTP版本不受支持(505)'
}

// 超过LOADING_DELAY时间，才显示Loading
const LOADING_DELAY = 100
let timer = null

// http request 拦截器
instance.interceptors.request.use(
  config => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      store.dispatch({ type: 'CHANGE_TOOLBOX_LOADING', payload: true })
    }, LOADING_DELAY)
    // 需要权限的接口的token验证
    const token = localStorage.getItem('AI_ADC_TOKEN')
    if (token) {
      config.headers.common.token = token
      config.headers.common.DEV_MODEL = '086e71e25c58fd1425017d562c9d5e31'
    }
    return config
  },
  error => {
    message.error('请求超时')
    return Promise.reject(error)
  }
)

// http response 拦截器
instance.interceptors.response.use(
  res => {
    clearTimeout(timer)
    store.dispatch({ type: 'CHANGE_TOOLBOX_LOADING', payload: false })
    if (res && res.data) {
      if (res.data.code === 20000) return res.data.data
      if (res.data.code === 50000) message.error(res.data.message || '接口错误!')
    } else message.error('服务器错误!')
    return Promise.reject()
  },
  async err => {
    clearTimeout(timer)
    store.dispatch({ type: 'CHANGE_TOOLBOX_LOADING', payload: false })
    if (err && err.response && err.response.status === 401) {
      message.warning('登录已失效，请重新登录.')
      await delay(1000)
      window.location.href = '/login'
      return
    }
    message.error((err && err.response && HTTP_ERROR_CODE[err.response.status]) || '连接服务器失败!')
    return Promise.reject(err)
  }
)

function post(url, data) {
  return new Promise(resolve => {
    instance
      .post(url, data)
      .then(res => resolve(res))
      .catch(() => {})
  })
}

function get(url) {
  return new Promise(resolve => {
    instance
      .get(url)
      .then(res => resolve(res))
      .catch(() => {})
  })
}
/**
 * 登录
 */
export const login = data => post('auth/login', data)
/**
 * 获取用户信息
 */
export const getUser = () => get('system/user/get/info/AIYEI_ADC')
