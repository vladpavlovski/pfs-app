import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import Scrollbar from '../../components/Scrollbar'
import SelectableMenuList from '../../containers/SelectableMenuList'
import { compose } from 'redux'
import { injectIntl } from 'react-intl'
import { withA2HS } from 'a2hs'
import { withAppConfigs } from '../../contexts/AppConfigProvider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

export const DrawerContent = props => {
  const { appConfig, dialogs, match, messaging, drawer } = props

  const handleChange = useCallback(
    (event, index) => {
      const { history, setDrawerMobileOpen } = props

      if (index !== undefined) {
        setDrawerMobileOpen(false)
      }

      if (index !== undefined && index !== Object(index)) {
        history.push(index)
      }
    },
    [props]
  )

  const handleSignOut = useCallback(async () => {
    const { userLogout, setDialogIsOpen, appConfig, setDrawerOpen } = props

    await appConfig.firebaseLoad().then(async ({ firebaseApp }) => {
      await firebaseApp
        .database()
        .ref(`users/${firebaseApp.auth().currentUser.uid}/connections`)
        .remove()
      await firebaseApp
        .database()
        .ref(
          `users/${firebaseApp.auth().currentUser.uid}/notificationTokens/${
            messaging.token
          }`
        )
        .remove()
      await firebaseApp
        .database()
        .ref(`users/${firebaseApp.auth().currentUser.uid}/lastOnline`)
        .set(new Date())
      await firebaseApp
        .auth()
        .signOut()
        .then(() => {
          userLogout()
          setDrawerOpen(false)
          setDialogIsOpen('auth_menu', false)
        })
    })
  }, [messaging.token, props])

  const isAuthMenu = useMemo(() => !!dialogs.auth_menu, [dialogs.auth_menu])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Scrollbar>
        {isAuthMenu && (
          <SelectableMenuList
            items={appConfig.getMenuItems({
              ...props,
              isAuthMenu,
              handleSignOut,
            })}
            onIndexChange={handleChange}
            index={match ? match.path : '/'}
            useMinified={drawer.useMinified && !drawer.open}
          />
        )}
        {!isAuthMenu && (
          <SelectableMenuList
            items={appConfig.getMenuItems({
              ...props,
              isAuthMenu,
              handleSignOut,
            })}
            onIndexChange={handleChange}
            index={match ? match.path : '/'}
            useMinified={drawer.useMinified && !drawer.open}
          />
        )}
      </Scrollbar>
    </div>
  )
}

DrawerContent.propTypes = {
  appConfig: PropTypes.shape({
    firebaseLoad: PropTypes.func,
    getMenuItems: PropTypes.func,
  }),
  dialogs: PropTypes.shape({
    auth_menu: PropTypes.any,
  }),
  drawer: PropTypes.shape({
    open: PropTypes.any,
    useMinified: PropTypes.any,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    path: PropTypes.any,
  }),
  messaging: PropTypes.shape({
    token: PropTypes.any,
  }),
  setDialogIsOpen: PropTypes.func,
  setDrawerMobileOpen: PropTypes.func,
  setDrawerOpen: PropTypes.func,
  userLogout: PropTypes.func,
}

export default compose(
  withA2HS,
  injectIntl,
  withRouter,
  withAppConfigs,
  withTheme
)(DrawerContent)
