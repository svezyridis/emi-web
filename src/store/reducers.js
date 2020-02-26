import { actiontypes as C } from '../general/constants'

export const account = (state = {}, action) => {
  switch (action.type) {
    case C.ADD_ACCOUNT:
      return {
        metadata: action.metadata
      }
    case C.DELETE_ACCOUNT:
      return {}
    default:
      return state
  }
}

export const open = (state = true, action) => {
  switch (action.type) {
    case C.TOOGLE_DRAWER:
      return !state
    default:
      return state
  }
}

export const dark = (state = false, action) => {
  switch (action.type) {
    case C.TOOGLE_DARK:
      return !state
    default:
      return state
  }
}
