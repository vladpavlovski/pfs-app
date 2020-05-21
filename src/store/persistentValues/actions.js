import * as types from './types'

export const setPersistentValue = (id, value) => ({
  type: types.ON_PERSISTENT_VALUE_CHANGED,
  id,
  value,
})
