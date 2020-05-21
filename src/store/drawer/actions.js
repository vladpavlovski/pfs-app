import * as types from './types'

export const setDrawerOpen = open => ({
  type: types.ON_DRAWER_OPEN_CHANGED,
  open,
})

export const setDrawerMobileOpen = mobileOpen => ({
  type: types.ON_DRAWER_MOBILE_OPEN_CHANGED,
  mobileOpen,
})

export const setDrawerUseMinified = useMinified => ({
  type: types.ON_DRAWER_USE_MINIFIED_CHANGED,
  useMinified,
})

export default { setDrawerMobileOpen, setDrawerOpen, setDrawerUseMinified }
