import * as types from './types'

export const setDialogIsOpen = (id, isOpen) => ({
  type: types.ON_DIALOG_OPEN_CHANGED,
  id,
  isOpen,
})
