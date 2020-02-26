import { actiontypes as C } from '../general/constants'
import jwt from 'jsonwebtoken'

export const deleteAccount = () => ({
  type: C.DELETE_ACCOUNT
})
export const newAccount = token => {
  var decoded = jwt.decode(token, { complete: true })
  return {
    type: C.ADD_ACCOUNT,
    metadata: JSON.parse(decoded.payload.metadata)
  }
}

export const toogleDrawer = toogle => ({
  type: C.TOOGLE_DRAWER,
  toogle: toogle
})

export const toogleDark = () => ({
  type: C.TOOGLE_DARK
})
