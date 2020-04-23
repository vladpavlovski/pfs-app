import PropTypes from 'prop-types'
import Activity from '../../containers/Activity'
import ChatsList from '../../containers/Chat/ChatsList'
import Input from '../../containers/Chat/Input'
import Messages from '../../containers/Chat/Messages'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth'

export const Chats = props => {
  const { intl, match, auth, width, title, history } = props

  const uid = useMemo(() => match.params.uid, [match.params.uid])

  return (
    <Activity
      onBackClick={
        isWidthUp('sm', width)
          ? undefined
          : () => {
              history.push('/chats')
            }
      }
      title={title || intl.formatMessage({ id: 'chats' })}
    >
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
        {isWidthUp('sm', width) && <ChatsList {...props} />}

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
            uid={uid}
            path={`user_chat_messages/${auth.uid}/${uid}`}
            receiverPath={`user_chat_messages/${uid}/${auth.uid}`}
            {...props}
          />
          <Input
            path={`user_chat_messages/${auth.uid}/${uid}`}
            receiverPath={`user_chat_messages/${uid}/${auth.uid}`}
            {...props}
          />
        </div>
      </div>
    </Activity>
  )
}

Chats.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.any,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      uid: PropTypes.any,
    }),
  }),
  title: PropTypes.func,
  width: PropTypes.any,
}

const mapStateToProps = state => {
  const { auth, persistentValues } = state

  return {
    auth,
    title: persistentValues['current_chat_name'],
  }
}

export default connect(mapStateToProps)(
  injectIntl(withRouter(withWidth()(Chats)))
)
