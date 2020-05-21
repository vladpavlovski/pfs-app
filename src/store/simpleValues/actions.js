import * as types from './types'

export const setSimpleValue = (id, value) => ({
  type: types.ON_SIMPLE_VALUE_CHANGED,
  id,
  value,
})
