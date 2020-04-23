import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import FacebookIcon from '@material-ui/icons/Facebook'
import { Activity } from 'rmw-shell'
import Scrollbar from '../../components/Scrollbar/Scrollbar'

const About = props => {
  const { intl } = props

  return (
    <Activity
      appBarContent={
        <IconButton
          href="https://www.facebook.com/groups/364185134231386"
          target="_blank"
          rel="noopener"
        >
          <FacebookIcon />
        </IconButton>
      }
      title={intl.formatMessage({ id: 'about' })}
    >
      <Scrollbar>
        <div style={{ backgroundColor: 'white', padding: 12 }}>
          Prague Footbal Socienty Rules
        </div>
      </Scrollbar>
    </Activity>
  )
}

About.propTypes = {
  intl: PropTypes.object.isRequired,
}

export default injectIntl(About)
