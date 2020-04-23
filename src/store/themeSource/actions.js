import * as types from './types'

export const updateTheme = theme => ({
  type: types.UPDATE_THEME,
  theme,
})

export const switchNightMode = isNightModeOn => ({
  type: types.SWITCH_NIGHT_MODE,
  isNightModeOn,
})
