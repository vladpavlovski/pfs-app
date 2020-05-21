import AltIconAvatar from '../../components/AltIconAvatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Person from '@material-ui/icons/Person'
import PropTypes from 'prop-types'
import React, { useMemo, useEffect, useCallback } from 'react'
import ReactList from 'react-list'
import Switch from '@material-ui/core/Switch'
import {
  FilterDrawer,
  filterSelectors,
  filterActions,
} from 'material-ui-filter'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

const UsersToggle = props => {
  const {
    watchList,
    path,
    setSearch,
    getValue,
    onChange,
    onClick,
    intl,
    list,
  } = props

  useEffect(() => {
    setSearch('users_toggle', '')
    watchList(path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderGrantItem = useCallback(
    (list, i) => {
      const userUid = list[i].key
      const user = list[i].val
      const checked = getValue(userUid)

      return (
        <div key={i}>
          <ListItem
            key={userUid}
            id={userUid}
            onClick={onClick ? () => onClick(userUid, user) : undefined}
          >
            <AltIconAvatar
              alt="person"
              src={user.thumbnail || user.photoURL}
              icon={<Person />}
            />
            <ListItemText
              primary={
                <div style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {user.displayName}
                </div>
              }
              secondaryText={
                <div style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {user.email}
                </div>
              }
            />
            <ListItemSecondaryAction>
              <Switch
                checked={checked === true}
                onChange={(e, newVal) => onChange(userUid, newVal)}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" />
        </div>
      )
    },
    [getValue, onChange, onClick]
  )

  const filterFields = useMemo(
    () => [
      {
        name: 'displayName',
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
    <div>
      <List style={{ height: '100%' }}>
        <ReactList
          itemRenderer={(i, k) => renderGrantItem(list, i, k)}
          length={list ? list.length : 0}
          type="uniform"
        />
      </List>
      <FilterDrawer
        name={'users_toggle'}
        fields={filterFields}
        formatMessage={intl.formatMessage}
      />
    </div>
  )
}

UsersToggle.propTypes = {
  getValue: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  list: PropTypes.shape({
    length: PropTypes.any,
  }),
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  path: PropTypes.any,
  setSearch: PropTypes.func,
  watchList: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const { auth, intl, lists, filters } = state
  const { getValue, onChange } = ownProps

  const path = 'users'
  const list = filterSelectors.getFilteredList(
    'users_toggle',
    filters,
    lists[path],
    fieldValue => fieldValue.val
  )

  return {
    path,
    getValue: getValue ? getValue : () => false,
    onChange: onChange ? onChange : () => {},
    list,
    filters,
    auth,
    intl,
    user_grants: lists.user_grants,
  }
}

export default connect(mapStateToProps, { setSimpleValue, ...filterActions })(
  injectIntl(withRouter(withFirebase(withTheme(UsersToggle))))
)
