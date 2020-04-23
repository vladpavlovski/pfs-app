import AudioPlayer from '../../containers/AudioPlayer'
import Chip from '@material-ui/core/Chip'
import Done from '@material-ui/icons/Done'
import DoneAll from '@material-ui/icons/DoneAll'
import IconButton from '@material-ui/core/IconButton'
import ImageViewer from '../../components/ImageViewer'
import Place from '@material-ui/icons/Place'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import moment from 'moment'
import { Typography } from '@material-ui/core'
import { compose, bindActionCreators } from 'redux'
import { injectIntl } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { useSelector, useDispatch } from 'react-redux'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'
import withConfig from '../../contexts/AppConfigProvider/withAppConfigs'

const getActions = dispatch => bindActionCreators({ setSimpleValue }, dispatch)

const getMapLoc = loc => {
  let lat = 0
  let lng = 0

  if (loc) {
    const data = loc.split('@') ? loc.split('@')[1] : false
    if (data) {
      lat = data.split(',')[0]
      lng = data.split(',')[1]
    }
  }

  return { lat, lng }
}

const Message = props => {
  const auth = useSelector(state => state.auth)
  const { setSimpleValue } = getActions(useDispatch())

  useEffect(() => {
    const { row, firebaseApp, path } = props

    const values = row.val

    if (auth.uid !== values.authorUid && !values.isRead) {
      firebaseApp.database().ref(`${path}/${row.key}`).update({
        isRead: true,
      })
      firebaseApp
        .database()
        .ref(`user_chats/${auth.uid}/${values.authorUid}/unread`)
        .remove()
    }
  }, [auth.uid, props])

  const {
    dataChanged,
    authorChanged,
    theme,
    values,
    uid,
    backgroundColor,
    color,
    intl,
    history,
    type,
    isGranted,
    scrollToBottom,
    appConfig,
  } = props

  const days = moment(values.created).diff(moment(), 'days')

  return (
    <div style={{ width: '100%' }}>
      <div>
        {dataChanged && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <div>
              <Chip
                label={`${
                  values.created
                    ? intl.formatRelativeTime(days, 'day', { numeric: 'auto' })
                    : undefined
                }`}
              />
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent:
              values.authorUid === auth.uid ? 'flex-end' : 'flex-start',
          }}
        >
          <div
            onDoubleClick={() => {
              if (isGranted('administrator')) {
                setSimpleValue('delete_message', uid)
              }
            }}
            style={{
              ...theme.chip,

              margin: 1,
              marginTop: authorChanged === true ? 8 : 1,
              boxShadow: theme.shadows[3],
              borderRadius:
                authorChanged === true
                  ? values.authorUid === auth.uid
                    ? '8px 0 8px 8px'
                    : '0 8px 8px 8px'
                  : '8px 8px 8px 8px',
              backgroundColor: backgroundColor,
              color: color,
              // fontFamily: theme.typography.fontFamily,
            }}
          >
            <div
              style={{
                display: type === 'image' ? undefined : 'flex',
                margin: type === 'image' ? 0 : 5,
                padding: type === 'image' ? 5 : 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 'fit-content',
              }}
            >
              <Typography
                variant="body1"
                color="inherit"
                style={{
                  maxWidth: 500,
                  width: 'fit-content',
                  fontSize: 16,
                  paddingLeft: 5,
                  margin: 'auto',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  // fontFamily: theme.typography.fontFamily,
                }}
              >
                {values.authorUid !== auth.uid && (
                  <div
                    onClick={() => {
                      history.push(`/chats/edit/${values.authorUid}`)
                    }}
                    style={{
                      color: theme.palette.secondary.main,
                      fontSize: 12,
                      marginLeft: 0,
                      cursor: 'pointer',
                    }}
                  >
                    {values.authorName}
                  </div>
                )}
                {type === 'location' && !appConfig.googleMaps && (
                  <div style={{ padding: 7 }}>
                    <div
                      style={{
                        textAlign: 'center',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <IconButton target="_blank" href={values.location}>
                        <Place color="secondary" />
                      </IconButton>
                      {intl.formatMessage({ id: 'my_location' })}
                    </div>
                  </div>
                )}

                {type === 'location' && appConfig.googleMaps && (
                  <img
                    alt="map"
                    onClick={() => {
                      window.open(values.location, 'blank')
                    }}
                    style={{
                      height: 'auto',
                      maxWidth: 400,
                      paddingTop: 0,
                      cursor: 'pointer',
                      borderRadius: 5,
                    }}
                    imageStyle={{
                      maxWidth: '100%',
                      padding: 0,
                      position: 'relative',
                      borderRadius: 5,
                    }}
                    onLoad={scrollToBottom}
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=%7C${
                      values.location.lat
                    },${getMapLoc(values.location).lng}&zoom=14&size=300x300
&markers=color:red%7Clabel:%7C${getMapLoc(values.location).lat},${
                      getMapLoc(values.location).lng
                    }
&key=${appConfig.googleMaps.apiKey}`}
                    color={backgroundColor}
                  />
                )}
                {type === 'audio' && (
                  <div style={{ padding: 7 }}>
                    <AudioPlayer
                      src={values.audio}
                      authorPhotoUrl={values.authorPhotoUrl}
                    />
                    {values.message}
                  </div>
                )}
                {type === 'link' && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={values.link}
                  >
                    {values.link}
                  </a>
                )}
                {type === 'image' && values.image !== null && (
                  <ImageViewer
                    style={{
                      height: 'auto',
                      maxWidth: 400,
                      paddingTop: 0,
                      cursor: 'pointer',
                      borderRadius: 5,
                    }}
                    imageStyle={{
                      maxWidth: '100%',
                      padding: 0,
                      position: 'relative',
                      borderRadius: 5,
                    }}
                    onLoad={scrollToBottom}
                    src={values.image}
                    color={backgroundColor}
                  />
                )}
                {type === 'text' && (
                  <Typography variant="body1">{values.message}</Typography>
                )}
              </Typography>
              <div
                style={{
                  fontSize: 9,
                  color:
                    values.authorUid !== auth.uid
                      ? theme.palette.text.secondary
                      : theme.palette.text.secondary,
                  marginLeft: 8,
                  alignSelf: 'flex-end',
                }}
              >
                {`${
                  values.created
                    ? intl.formatTime(new Date(values.created))
                    : undefined
                }`}
                {values.isSend && values.isReceived && (
                  <DoneAll
                    style={{
                      fontSize: 11,
                      padding: 0,
                      paddingLeft: 2,
                      bottom: -2,
                      color: values.isRead
                        ? theme.palette.secondary.main
                        : theme.palette.text.primary,
                    }}
                  />
                )}
                {values.isSend && !values.isReceived && (
                  <Done
                    style={{
                      fontSize: 11,
                      padding: 0,
                      paddingLeft: 2,
                      bottom: -2,
                      color: values.isRead
                        ? theme.palette.secondary.main
                        : theme.palette.text.primary,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Message.propTypes = {
  appConfig: PropTypes.shape({
    googleMaps: PropTypes.shape({
      apiKey: PropTypes.any,
    }),
  }),
  authorChanged: PropTypes.bool,
  backgroundColor: PropTypes.any,
  color: PropTypes.any,
  dataChanged: PropTypes.any,
  firebaseApp: PropTypes.shape({
    database: PropTypes.func,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
    formatRelativeTime: PropTypes.func,
    formatTime: PropTypes.func,
  }),
  isGranted: PropTypes.func,
  path: PropTypes.any,
  row: PropTypes.shape({
    key: PropTypes.any,
    val: PropTypes.shape({
      authorUid: PropTypes.any,
      isRead: PropTypes.any,
    }),
  }),
  scrollToBottom: PropTypes.any,
  theme: PropTypes.shape({
    chip: PropTypes.any,
    palette: PropTypes.shape({
      secondary: PropTypes.shape({
        main: PropTypes.any,
      }),
      text: PropTypes.shape({
        primary: PropTypes.any,
        secondary: PropTypes.any,
      }),
    }),
    shadows: PropTypes.any,
    typography: PropTypes.shape({
      fontFamily: PropTypes.any,
    }),
  }),
  type: PropTypes.string,
  uid: PropTypes.any,
  values: PropTypes.shape({
    audio: PropTypes.any,
    authorName: PropTypes.any,
    authorPhotoUrl: PropTypes.any,
    authorUid: PropTypes.any,
    created: PropTypes.any,
    image: PropTypes.any,
    isRead: PropTypes.any,
    isReceived: PropTypes.any,
    isSend: PropTypes.any,
    link: PropTypes.any,
    location: PropTypes.shape({
      lat: PropTypes.any,
    }),
    message: PropTypes.any,
  }),
}

export default compose(
  injectIntl,
  withTheme,
  withRouter,
  withFirebase,
  withConfig
)(Message)
