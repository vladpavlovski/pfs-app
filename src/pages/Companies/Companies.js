import AltIconAvatar from '../../components/AltIconAvatar'
import PropTypes from 'prop-types'
import Business from '@material-ui/icons/Business'
import Divider from '@material-ui/core/Divider'
import ListActivity from '../../containers/Activities/ListActivity'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React, { useCallback } from 'react'
import { compose } from 'redux'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

const filterFields = [
  { name: 'name' },
  { name: 'full_name' },
  { name: 'workers', type: 'number' },
  { name: 'worth', type: 'number' },
]
const Companies = props => {
  const { history } = props
  const renderItem = useCallback(
    (key, val) => {
      const { name = '', full_name = '', workers = '', worth = '' } = val

      return (
        <div key={key}>
          <ListItem
            onClick={() => history.push(`/companies/edit/${key}`)}
            key={key}
          >
            <AltIconAvatar
              alt="company"
              src={val.photoURL}
              icon={<Business />}
            />
            <ListItemText
              primary={name}
              secondary={full_name}
              style={{ maxWidth: 250 }}
            />
            <ListItemText
              primary={workers}
              secondary={worth}
              style={{ maxWidth: 150 }}
            />
          </ListItem>
          <Divider variant="inset" />
        </div>
      )
    },
    [history]
  )

  return (
    <ListActivity
      name="companies"
      createGrant="create_company"
      filterFields={filterFields}
      renderItem={renderItem}
    />
  )
}

Companies.propTypes = {
  history: PropTypes.object.isRequired,
}

export default compose(injectIntl, withRouter, withTheme)(Companies)
