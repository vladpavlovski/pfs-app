import AltIconAvatar from '../../components/AltIconAvatar'
import Check from '@material-ui/icons/Check'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import PropTypes from 'prop-types'
import React, { useEffect, useCallback, useMemo } from 'react'
import ReactList from 'react-list'
import Switch from '@material-ui/core/Switch'
import {
  FilterDrawer,
  filterSelectors,
  filterActions,
} from 'material-ui-filter'
import { connect } from 'react-redux'
import { getList } from 'firekit'
import { injectIntl } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withAppConfigs } from '../../contexts/AppConfigProvider'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

const UserGrants = props => {
  const {
    watchList,
    user_grants,
    intl,
    appConfig,
    firebaseApp,
    userGrantsPath,
    filters,
  } = props
  useEffect(() => {
    watchList(userGrantsPath)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGrantToggleChange = useCallback(
    (e, isInputChecked, key) => {
      const ref = firebaseApp.database().ref(`${userGrantsPath}/${key}`)

      if (isInputChecked) {
        ref.set(true)
      } else {
        ref.remove()
      }
    },
    [firebaseApp, userGrantsPath]
  )

  const renderGrantItem = useCallback(
    (list, i) => {
      const key = list[i].val ? list[i].val.value : ''
      const val = appConfig.grants[list[i].key]
      let userGrants = []

      if (user_grants !== undefined) {
        user_grants.map(role => {
          if (role.key === key) {
            if (role.val !== undefined) {
              userGrants[role.key] = role.val
            }
          }
          return role
        })
      }

      return (
        <div key={key}>
          <ListItem key={i} id={i}>
            <AltIconAvatar icon={<Check />} />
            <ListItemText
              primary={intl.formatMessage({ id: `grant_${val}` })}
              secondary={val}
            />
            <ListItemSecondaryAction>
              <Switch
                checked={userGrants[key] === true}
                onChange={(e, isInputChecked) => {
                  handleGrantToggleChange(e, isInputChecked, key)
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" />
        </div>
      )
    },
    [appConfig.grants, handleGrantToggleChange, intl, user_grants]
  )

  const grantList = useMemo(
    () =>
      appConfig.grants.map((grant, index) => {
        return {
          key: index,
          val: {
            name: intl.formatMessage({ id: `grant_${grant}` }),
            value: grant,
          },
        }
      }),
    [appConfig.grants, intl]
  )

  const list = useMemo(
    () =>
      filterSelectors.getFilteredList(
        'user_grants',
        filters,
        grantList,
        fieldValue => fieldValue.val
      ),
    [filters, grantList]
  )

  const filterFields = useMemo(
    () => [
      {
        name: 'name',
        label: intl.formatMessage({ id: 'name_label' }),
      },
      {
        name: 'value',
        label: intl.formatMessage({ id: 'value_label' }),
      },
    ],
    [intl]
  )

  return (
    <div style={{ height: '100%' }}>
      <List style={{ height: '100%' }}>
        <ReactList
          itemRenderer={(i, k) => renderGrantItem(list, i, k)}
          length={list ? list.length : 0}
          type="simple"
        />
      </List>
      <FilterDrawer name={'user_grants'} fields={filterFields} />
    </div>
  )
}

UserGrants.propTypes = {
  appConfig: PropTypes.shape({
    grants: PropTypes.shape({
      map: PropTypes.func,
    }),
  }),
  filters: PropTypes.any,
  firebaseApp: PropTypes.shape({
    database: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  userGrantsPath: PropTypes.any,
  user_grants: PropTypes.shape({
    map: PropTypes.func,
  }),
  watchList: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const { auth, intl, filters } = state
  const { match } = ownProps

  const uid = match.params.uid
  const rootPath = match.params.rootPath
  const rootUid = match.params.rootUid
  const userGrantsPath = rootPath
    ? `/${rootPath}_user_grants/${uid}/${rootUid}`
    : `/user_grants/${uid}`

  return {
    filters,
    auth,
    uid,
    intl,
    userGrantsPath,
    user_grants: getList(state, userGrantsPath),
  }
}

export default connect(mapStateToProps, { setSimpleValue, ...filterActions })(
  injectIntl(withRouter(withFirebase(withAppConfigs(withTheme(UserGrants)))))
)
