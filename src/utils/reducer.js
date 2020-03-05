const reducer = (
  state = {
    shiftMultipleMode: false,
    activeMenu: 'adc',
    toolBoxLoading: false
  },
  action
) => {
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

export default reducer
