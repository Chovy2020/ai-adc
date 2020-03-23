const reducer = (
  state = {
    shiftMultipleMode: false,
    activeMenu: '',
    toolBoxLoading: false,
    classifyCodes: [],
    user: null,
    permissions: []
  },
  action
) => {
  switch (action.type) {
    case 'CHANGE_USER':
      return {
        ...state,
        user: action.payload,
        permissions: action.payload.buttons
      }
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
