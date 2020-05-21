import PropTypes from 'prop-types'
import Activity from '../../containers/Activity'
import Input from '../../containers/Chat/Input'
import Messages from '../../containers/Chat/Messages'
import React from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'

const Chats = props => {
  const { intl } = props

  return (
    <Activity title={intl.formatMessage({ id: 'chats' })}>
      <div
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'stretch',
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 0,
            flexGrow: 1,
          }}
        >
          <Messages
            path={'public_chats'}
            receiverPath={'public_chats'}
            {...props}
          />
          <Input
            path={'public_chats'}
            receiverPath={'public_chats'}
            {...props}
          />
        </div>
      </div>
    </Activity>
  )
}

Chats.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
}

export default connect()(injectIntl(withRouter(Chats)))
