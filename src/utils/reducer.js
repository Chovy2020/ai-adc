// 全局数据
const initialState = {
  shiftMultipleMode: false,
  activeMenu: 'adc',
  toolBoxLoading: false
}

const initReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_SHIFT_MULTIPLE_MODE':
      return {
        ...state,
        shiftMultipleMode: action.payload
      }
    case 'CHANGE_MENU':
      return {
        ...state,
        activeMenu: action.payload
      }
    case 'CHANGE_TOOLBOX_LOADING':
      return {
        ...state,
        toolBoxLoading: action.payload
      }
    default:
      return state
  }
}

export default initReducer
