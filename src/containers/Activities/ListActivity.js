import Activity from '../Activity'
import Add from '@material-ui/icons/Add'
import FilterList from '@material-ui/icons/FilterList'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
import ReactList from 'react-list'
import Scrollbar from '../../components/Scrollbar'
import SearchField from '../../components/SearchField'
import Tooltip from '@material-ui/core/Tooltip'
import isGranted from '../../utils/auth'
import { Fab } from '@material-ui/core'
import {
  FilterDrawer,
  filterSelectors,
  filterActions,
} from 'material-ui-filter'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getList } from 'firekit'
import { getLocation } from 'firekit/lib/store/lists/actions'
import { injectIntl } from 'react-intl'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'

const ListActivity = props => {
  const {
    watchList,
    unwatchList,
    path,
    name,
    createGrant,
    filterFields,
    hasFilters,
    history,
    intl,
    isGranted,
    list,
    setFilterIsOpen,
    renderItem,
    handleCreateClick,
    disableCreate,
    title,
    activityProps = {},
    reactListProps = {},
  } = props

  useEffect(() => {
    watchList(path || name)
    return () => {
      unwatchList(path || name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fields = useMemo(
    () =>
      filterFields.map(field =>
        !field.label
          ? {
              label: intl.formatMessage({ id: `${field.name}_label` }),
              ...field,
            }
          : field
      ),
    [filterFields, intl]
  )

  return (
    <Activity
      title={title || intl.formatMessage({ id: name })}
      appBarContent={
        <div style={{ display: 'flex' }}>
          <SearchField filterName={name} />
          <Tooltip title={intl.formatMessage({ id: 'open_filter' })}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => {
                setFilterIsOpen(name, true)
              }}
            >
              <FilterList color={hasFilters ? 'secondary' : 'inherit'} />
            </IconButton>
          </Tooltip>
        </div>
      }
      {...activityProps}
    >
      <div style={{ height: '100%' }}>
        <Scrollbar>
          <List>
            <ReactList
              itemRenderer={i => renderItem(list[i].key, list[i].val)}
              length={list ? list.length : 0}
              type="simple"
              {...reactListProps}
            />
          </List>
        </Scrollbar>
        <div style={{ float: 'left', clear: 'both' }} />
        {disableCreate !== true && isGranted(createGrant) && (
          <Fab
            onClick={
              handleCreateClick != null
                ? handleCreateClick
                : () => {
                    history.push(`/${name}/create`)
                  }
            }
            style={{ position: 'fixed', bottom: 15, right: 20, zIndex: 99 }}
            color={'secondary'}
          >
            <Add />
          </Fab>
        )}
      </div>
      <FilterDrawer
        name={name}
        fields={fields}
        formatMessage={intl.formatMessage}
      />
    </Activity>
  )
}

ListActivity.propTypes = {
  activityProps: PropTypes.object,
  createGrant: PropTypes.any,
  disableCreate: PropTypes.bool,
  filterFields: PropTypes.array,
  handleCreateClick: PropTypes.any,
  hasFilters: PropTypes.any,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  isGranted: PropTypes.func,
  list: PropTypes.array,
  name: PropTypes.any,
  path: PropTypes.any,
  reactListProps: PropTypes.object,
  renderItem: PropTypes.func,
  setFilterIsOpen: PropTypes.func,
  title: PropTypes.string,
  unwatchList: PropTypes.func,
  watchList: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const { firebaseApp } = ownProps
  const { filters } = state
  const { name, path, isGranted: customIsGranted } = ownProps

  const location = firebaseApp ? getLocation(firebaseApp, path) : path
  const ref = location || name

  const { hasFilters } = filterSelectors.selectFilterProps(name, filters)
  const list = filterSelectors.getFilteredList(
    ref,
    filters,
    getList(state, ref),
    fieldValue => fieldValue.val
  )

  return {
    ref,
    name,
    hasFilters,
    list,
    isGranted: grant =>
      customIsGranted ? customIsGranted(state, grant) : isGranted(state, grant),
  }
}

export default compose(
  connect(mapStateToProps, { ...filterActions }),
  injectIntl,
  withFirebase,
  withRouter
)(ListActivity)
