const reducer = (
  state = {
    shiftMultipleMode: false,
    activeMenu: 'adc',
    toolBoxLoading: false,
    classifyCodes: []
  },
  action
) => {
  switch (action.type) {
    case 'CLASSIFY_CODES_INIT':
      return {
        ...state,
        classifyCodes: action.payload
      }
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

export default reducer
