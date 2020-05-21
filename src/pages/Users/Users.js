import Activity from '../../containers/Activity'
import AltIconAvatar from '../../components/AltIconAvatar'
import Divider from '@material-ui/core/Divider'
import Email from '@material-ui/icons/Email'
import FilterList from '@material-ui/icons/FilterList'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import OfflinePin from '@material-ui/icons/OfflinePin'
import Phone from '@material-ui/icons/Phone'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect } from 'react'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar'
import SearchField from '../../components/SearchField'
import Toolbar from '@material-ui/core/Toolbar'
import {
  FilterDrawer,
  filterSelectors,
  filterActions,
} from 'material-ui-filter'
import {
  GoogleIcon,
  FacebookIcon,
  GitHubIcon,
  TwitterIcon,
} from '../../components/Icons'
import { connect } from 'react-redux'
import { getList, isLoading } from 'firekit'
import { injectIntl } from 'react-intl'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'
import Person from '@material-ui/icons/Person'

const path = 'users'

export const Users = props => {
  const {
    watchList,
    history,
    isSelecting,
    list,
    intl,
    theme,
    setFilterIsOpen,
    hasFilters,
    isLoading,
  } = props
  useEffect(() => {
    watchList(path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProviderIcon = useCallback(provider => {
    const color = 'primary'

    switch (provider.providerId) {
      case 'google.com':
        return <GoogleIcon color={color} />
      case 'facebook.com':
        return <FacebookIcon color={color} />
      case 'twitter.com':
        return <TwitterIcon color={color} />
      case 'github.com':
        return <GitHubIcon color={color} />
      case 'phone':
        return <Phone color={color} />
      case 'password':
        return <Email color={color} />
      default:
        return undefined
    }
  }, [])

  const handleRowClick = useCallback(
    user => {
      history.push(
        isSelecting
          ? `/${isSelecting}/${user.key}`
          : `/${path}/edit/${user.key}/profile`
      )
    },
    [history, isSelecting]
  )

  const renderItem = useCallback(
    (index, key) => {
      const {
        displayName = 'User',
        thumbnail,
        photoURL,
        lastOnline,
        connections,
        providerData,
      } = list[index].val || {}

      return (
        <div key={key}>
          <ListItem
            key={key}
            onClick={() => {
              handleRowClick(list[index])
            }}
            id={key}
          >
            <AltIconAvatar src={thumbnail || photoURL} icon={<Person />} />

            <ListItemText
              primary={displayName}
              secondary={
                !connections && !lastOnline
                  ? intl.formatMessage({ id: 'offline' })
                  : intl.formatMessage({ id: 'online' })
              }
            />

            <Toolbar>
              {providerData &&
                providerData.map((p, i) => {
                  return <div key={i}>{getProviderIcon(p)}</div>
                })}
            </Toolbar>
            <OfflinePin color={connections ? 'primary' : 'disabled'} />
          </ListItem>
          <Divider variant="inset" />
        </div>
      )
    },
    [getProviderIcon, handleRowClick, intl, list]
  )

  const filterFields = [
    {
      name: 'displayName',
      label: intl.formatMessage({ id: 'name' }),
    },
    {
      name: 'creationTime',
      type: 'date',
      label: intl.formatMessage({ id: 'creation_time' }),
    },
  ]

  return (
    <Activity
      title={intl.formatMessage({ id: 'users' })}
      appBarContent={
        <div style={{ display: 'flex' }}>
          <SearchField filterName={'users'} />

          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => {
              setFilterIsOpen('users', true)
            }}
          >
            <FilterList
              className="material-icons"
              color={
                hasFilters
                  ? theme.palette.accent1Color
                  : theme.palette.canvasColor
              }
            />
          </IconButton>
        </div>
      }
      isLoading={isLoading}
    >
      <div style={{ height: '100%', overflow: 'none' }}>
        <Scrollbar>
          <List id="test" component="div">
            <ReactList
              itemRenderer={renderItem}
              length={list ? list.length : 0}
              type="uniform"
            />
          </List>
        </Scrollbar>
      </div>
      <FilterDrawer name={'users'} fields={filterFields} />
    </Activity>
  )
}

Users.propTypes = {
  hasFilters: PropTypes.any,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  isLoading: PropTypes.any,
  isSelecting: PropTypes.any,
  list: PropTypes.array,
  setFilterIsOpen: PropTypes.func,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      accent1Color: PropTypes.any,
      canvasColor: PropTypes.any,
    }),
  }),
  watchList: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const { auth, filters } = state
  const { match } = ownProps

  const isSelecting = match.params.select ? match.params.select : false

  const { hasFilters } = filterSelectors.selectFilterProps('users', filters)
  const list = filterSelectors.getFilteredList(
    'users',
    filters,
    getList(state, path),
    fieldValue => fieldValue.val
  )

  return {
    isSelecting,
    hasFilters,
    isLoading: isLoading(state, path),
    list,
    auth,
  }
}

export default connect(mapStateToProps, { ...filterActions })(
  injectIntl(withTheme(withFirebase(withRouter(Users))))
)
