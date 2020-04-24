import PropTypes from 'prop-types'
import AccountBox from '@material-ui/icons/AccountBox'
import Activity from '../../containers/Activity'
import Add from '@material-ui/icons/Add'
import AltIconAvatar from '../../components/AltIconAvatar'

import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React, { useCallback, useEffect } from 'react'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar/Scrollbar'
import { Fab } from '@material-ui/core'
import { connect } from 'react-redux'
import { getList, isLoading } from 'firekit'
import { injectIntl } from 'react-intl'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'

const path = 'roles'

const Roles = props => {
  const {
    watchList,
    unwatchList,
    firebaseApp,
    history,
    list,
    intl,
    isLoading,
  } = props

  useEffect(() => {
    watchList(path)
    return () => {
      unwatchList(path)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreateClick = useCallback(() => {
    const newRole = firebaseApp.database().ref(`/${path}`).push()

    newRole.update({ name: 'New Role' }).then(() => {
      history.push(`/${path}/edit/${newRole.key}/main`)
    })
  }, [firebaseApp, history])

  const renderItem = useCallback(
    i => {
      const key = list[i].key
      const val = list[i].val

      return (
        <div key={key}>
          <ListItem
            key={i}
            onClick={() => {
              history.push(`/${path}/edit/${key}/main`)
            }}
            id={i}
          >
            <AltIconAvatar icon={<AccountBox />} />
            <ListItemText primary={val.name} secondary={val.description} />
          </ListItem>
          <Divider variant="inset" />
        </div>
      )
    },
    [history, list]
  )

  return (
    <Activity isLoading={isLoading} title={intl.formatMessage({ id: 'roles' })}>
      <div style={{ height: '100%' }}>
        <Scrollbar>
          <List
            ref={field => {
              this.list = field
            }}
          >
            <ReactList
              itemRenderer={renderItem}
              length={list.length}
              type="simple"
            />
          </List>
        </Scrollbar>
        <div style={{ float: 'left', clear: 'both' }} />

        <div style={{ position: 'fixed', right: 18, zIndex: 3, bottom: 18 }}>
          <Fab color="secondary" onClick={handleCreateClick}>
            <Add className="material-icons" />
          </Fab>
        </div>
      </div>
    </Activity>
  )
}

Roles.propTypes = {
  firebaseApp: PropTypes.shape({
    database: PropTypes.func,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  isLoading: PropTypes.any,
  list: PropTypes.array,
  watchList: PropTypes.func,
  unwatchList: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    list: getList(state, path),
    isLoading: isLoading(state, path),
  }
}

export default connect(mapStateToProps)(
  injectIntl(withFirebase(withRouter(Roles)))
)
