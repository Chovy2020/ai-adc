const reducer = (
  state = {
    shiftMultipleMode: false,
    activeMenu: '',
    toolBoxLoading: false,
    classifyCodes: [],
    permissions: ['adc:classification:view', 'adc:classification:add_to_library'],
    customRoutes: ['/classification', '/library', '/builder', '/reporting', '/config']
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
