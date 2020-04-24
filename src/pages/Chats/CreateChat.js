import Activity from '../../containers/Activity'
import AltIconAvatar from '../../components/AltIconAvatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Person from '@material-ui/icons/Person'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect } from 'react'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar'
import SearchField from '../../components/SearchField'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { filterSelectors, filterActions } from 'material-ui-filter'
import { getList, isLoading } from 'firekit'
import { injectIntl } from 'react-intl'
import { setPersistentValue } from '../../store/persistentValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

const path = 'users'

const Users = props => {
  const {
    watchList,
    unwatchList,
    auth,
    firebaseApp,
    history,
    usePreview,
    setPersistentValue,
    users,
    intl,
    isLoading,
    theme,
  } = props

  useEffect(() => {
    watchList(path)
    return () => {
      unwatchList(path)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRowClick = useCallback(
    user => {
      const key = user.key
      const userValues = user.val
      const userChatsRef = firebaseApp
        .database()
        .ref(`/user_chats/${auth.uid}/${key}`)

      const chatData = {
        displayName: userValues.displayName,
        photoURL: userValues.photoURL ? userValues.photoURL : '',
        lastMessage: '',
      }

      userChatsRef.update({ ...chatData })

      if (usePreview) {
        setPersistentValue('current_chat_uid', key)
        history.push('/chats')
      } else {
        history.push(`/chats/edit/${key}`)
      }
    },
    [auth.uid, firebaseApp, history, setPersistentValue, usePreview]
  )

  const renderItem = useCallback(
    (index, key) => {
      const user = users[index].val

      //We hide ourselfe to not create a chat with ourself
      if (user.uid === auth.uid) {
        return <div key={key} />
      }

      return (
        <div key={key}>
          <ListItem
            key={key}
            onClick={() => {
              handleRowClick(users[index])
            }}
            id={key}
          >
            <AltIconAvatar src={user.photoURL} icon={<Person />} />

            <ListItemText
              primary={user.displayName}
              secondary={
                !user.connections && !user.lastOnline
                  ? intl.formatMessage({ id: 'offline' })
                  : intl.formatMessage({ id: 'online' })
              }
            />
          </ListItem>
          <Divider variant="inset" />
        </div>
      )
    },
    [auth.uid, handleRowClick, intl, users]
  )

  return (
    <Activity
      title={intl.formatMessage({ id: 'users' })}
      onBackClick={() => history.back()}
      appBarContent={
        <div style={{ display: 'flex' }}>
          <SearchField filterName={'select_user'} />
        </div>
      }
      isLoading={isLoading}
    >
      <div
        style={{
          height: '100%',
          overflow: 'none',
          backgroundColor: theme.palette.convasColor,
        }}
      >
        <Scrollbar>
          <List id="test">
            <ReactList
              itemRenderer={renderItem}
              length={users ? users.length : 0}
              type="simple"
            />
          </List>
        </Scrollbar>
      </div>
    </Activity>
  )
}

Users.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.any,
  }),
  firebaseApp: PropTypes.shape({
    database: PropTypes.func,
  }),
  history: PropTypes.shape({
    back: PropTypes.func,
    push: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  isLoading: PropTypes.any,
  setPersistentValue: PropTypes.func,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      convasColor: PropTypes.any,
    }),
  }),
  unwatchList: PropTypes.func,
  usePreview: PropTypes.any,
  users: PropTypes.array,
  watchList: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const { auth, filters } = state
  const { width } = ownProps

  const { hasFilters } = filterSelectors.selectFilterProps(
    'select_user',
    filters
  )
  const users = filterSelectors.getFilteredList(
    'select_user',
    filters,
    getList(state, 'users'),
    fieldValue => fieldValue.val
  )
  const usePreview = isWidthUp('sm', width)

  return {
    usePreview,
    hasFilters,
    isLoading: isLoading(state, 'users'),
    users,
    auth,
  }
}

export default compose(
  connect(mapStateToProps, { ...filterActions, setPersistentValue }),
  injectIntl,
  withFirebase,
  withRouter,
  withWidth(),
  withTheme
)(Users)
