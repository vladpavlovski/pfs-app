import Activity from '../../containers/Activity'
import Avatar from '@material-ui/core/Avatar'
import Delete from '@material-ui/icons/Delete'
import Error from '@material-ui/icons/Error'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import Person from '@material-ui/icons/Person'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import PropTypes from 'prop-types'
import QuestionDialog from '../../containers/QuestionDialog'
import React, { useState, useCallback, useEffect, useMemo } from 'react'
import Save from '@material-ui/icons/Save'
import Switch from '@material-ui/core/Switch'
import VerifiedUser from '@material-ui/icons/VerifiedUser'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import classNames from 'classnames'
import requestNotificationPermission from '../../utils/messaging'
import {
  GoogleIcon,
  FacebookIcon,
  GitHubIcon,
  TwitterIcon,
} from '../../components/Icons'
import { ImageCropDialog } from '../../containers/ImageCropDialog'
import { change, submit, formValueSelector } from 'redux-form'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getList, getPath } from 'firekit'
import { injectIntl } from 'react-intl'
import { setDialogIsOpen } from '../../store/dialogs/actions'
import { setPersistentValue } from '../../store/persistentValues/actions'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withAppConfigs } from '../../contexts/AppConfigProvider'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme, withStyles } from '@material-ui/core/styles'

const form_name = 'my_account'

const styles = theme => ({
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 120,
    height: 120,
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(1) * 3,
  },
  textField: {},
})

const MyAccount = props => {
  const {
    firebaseApp,
    auth,
    authError,
    setSimpleValue,
    setDialogIsOpen,
    authStateChanged,
    intl,
    appConfig,
    classes,
    new_user_photo,
    notificationTokens,
    emailNotifications = false,
    watchList,
    watchPath,
  } = props
  console.log('MYAcc: ', auth)

  const [errors, setErrors] = useState({})
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [values, setValues] = useState({
    displayName: auth.displayName,
    email: auth.email,
    photoURL: auth.photoURL,
    password: '',
    newPassword: '',
    confirmPassword: '',
  })

  const validate = useCallback(() => {
    const providerId = auth.providerData[0].providerId
    const newErrors = {}

    if (!values.displayName) {
      newErrors.displayName = 'Required'
    }

    if (!values.email) {
      newErrors.email = 'Required'
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      newErrors.email = 'Invalid email address'
    } else if (
      !values.password &&
      providerId === 'password' &&
      auth.email.localeCompare(values.email)
    ) {
      newErrors.password = 'For email change enter your password'
    }

    if (values.newPassword) {
      if (values.newPassword.length < 6) {
        newErrors.newPassword = 'Password should be at least 6 characters'
      } else if (values.newPassword.localeCompare(values.confirmPassword)) {
        newErrors.newPassword = 'Must be equal'
        newErrors.confirmPassword = 'Must be equal'
      }

      if (!values.password) {
        newErrors.password = 'Required'
      }
    }

    setErrors(newErrors)
  }, [
    auth.email,
    auth.providerData,
    values.confirmPassword,
    values.displayName,
    values.email,
    values.newPassword,
    values.password,
  ])

  const updateValue = useCallback(
    (name, value) => {
      setValues({
        ...values,
        [name]: value || '',
      })
      validate()
    },
    [validate, values]
  )

  const isLinkedWithProvider = useCallback(
    provider => {
      try {
        return (
          auth &&
          auth.providerData &&
          auth.providerData.find(p => {
            return p.providerId === provider
          }) !== undefined
        )
      } catch (e) {
        return false
      }
    },
    [auth]
  )

  const getProviderIcon = useCallback(p => {
    switch (p) {
      case 'google.com':
        return <GoogleIcon />

      case 'facebook.com':
        return <FacebookIcon />

      case 'twitter.com':
        return <TwitterIcon />

      case 'github.com':
        return <GitHubIcon />

      default:
        return undefined
    }
  }, [])

  const handleEmailVerificationsSend = useCallback(() => {
    firebaseApp
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        alert('Verification E-Mail send')
      })
  }, [firebaseApp])

  const handlePhotoUploadSuccess = useCallback(
    snapshot => {
      snapshot.ref.getDownloadURL().then(downloadURL => {
        updateValue('photoURL', downloadURL)
        setIsPhotoDialogOpen(false)
      })
    },
    [updateValue]
  )

  const getProvider = useCallback((firebase, provider) => {
    if (provider.indexOf('facebook') > -1) {
      return new firebase.auth.FacebookAuthProvider()
    }
    if (provider.indexOf('github') > -1) {
      return new firebase.auth.GithubAuthProvider()
    }
    if (provider.indexOf('google') > -1) {
      return new firebase.auth.GoogleAuthProvider()
    }
    if (provider.indexOf('twitter') > -1) {
      return new firebase.auth.TwitterAuthProvider()
    }
    if (provider.indexOf('phone') > -1) {
      return new firebase.auth.PhoneAuthProvider()
    }

    throw new Error('Provider is not supported!')
  }, [])

  const reauthenticateUser = useCallback(
    (values, onSuccess) => {
      import('firebase').then(firebase => {
        if (isLinkedWithProvider('password') && !values) {
          if (onSuccess && onSuccess instanceof Function) {
            onSuccess()
          }
        } else if (isLinkedWithProvider('password') && values) {
          const credential = firebase.auth.EmailAuthProvider.credential(
            auth.email,
            values.password
          )
          firebaseApp
            .auth()
            .currentUser.reauthenticateWithCredential(credential)
            .then(
              () => {
                if (onSuccess && onSuccess instanceof Function) {
                  onSuccess()
                }
              },
              e => {
                authError(e)
              }
            )
        } else {
          firebaseApp
            .auth()
            .currentUser.reauthenticateWithPopup(
              getProvider(firebase, auth.providerData[0].providerId)
            )
            .then(
              () => {
                if (onSuccess && onSuccess instanceof Function) {
                  onSuccess()
                }
              },
              e => {
                authError(e)
              }
            )
        }
      })
    },
    [
      auth.email,
      auth.providerData,
      authError,
      firebaseApp,
      getProvider,
      isLinkedWithProvider,
    ]
  )

  const linkUserWithPopup = useCallback(
    p => {
      import('firebase').then(firebase => {
        const provider = getProvider(firebase, p)

        firebaseApp
          .auth()
          .currentUser.linkWithPopup(provider)
          .then(
            () => {
              authStateChanged(firebaseApp.auth().currentUser)
            },
            e => {
              authError(e)
            }
          )
      })
    },
    [authError, authStateChanged, firebaseApp, getProvider]
  )

  const clean = useCallback(obj => {
    Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
    return obj
  }, [])

  const submit = useCallback(() => {
    const simpleChange =
      (values.displayName &&
        values.displayName.localeCompare(auth.displayName)) ||
      (values.photoURL && values.photoURL.localeCompare(auth.photoURL))

    let simpleValues = {
      displayName: values.displayName,
      photoURL: values.photoURL,
    }

    //Change simple data
    if (simpleChange) {
      firebaseApp
        .auth()
        .currentUser.updateProfile(simpleValues)
        .then(
          () => {
            firebaseApp
              .database()
              .ref(`users/${auth.uid}`)
              .update(clean(simpleValues))
              .then(
                () => {
                  authStateChanged(values)
                },
                e => {
                  authError(e)
                }
              )
          },
          e => {
            authError(e)
          }
        )
    }

    //Change email
    if (values.email && values.email.localeCompare(auth.email)) {
      reauthenticateUser(values, () => {
        firebaseApp
          .auth()
          .currentUser.updateEmail(values.email)
          .then(
            () => {
              firebaseApp
                .database()
                .ref(`users/${auth.uid}`)
                .update({ email: values.email })
                .then(
                  () => {
                    authStateChanged({ email: values.email })
                  },
                  e => {
                    authError(e)
                  }
                )
            },
            e => {
              authError(e)

              if (e.code === 'auth/requires-recent-login') {
                firebaseApp
                  .auth()
                  .signOut()
                  .then(function () {
                    setTimeout(() => {
                      alert('Please sign in again to change your email.')
                    }, 1)
                  })
              }
            }
          )
      })
    }

    //Change password
    if (values.newPassword) {
      reauthenticateUser(values, () => {
        firebaseApp
          .auth()
          .currentUser.updatePassword(values.newPassword)
          .then(
            () => {
              firebaseApp.auth().signOut()
            },
            e => {
              authError(e)

              if (e.code === 'auth/requires-recent-login') {
                firebaseApp
                  .auth()
                  .signOut()
                  .then(() => {
                    setTimeout(() => {
                      alert('Please sign in again to change your password.')
                    }, 1)
                  })
              }
            }
          )
      })
    }

    //setSimpleValue('new_user_photo', undefined);

    // We manage the data saving above
    return false
  }, [
    auth.displayName,
    auth.email,
    auth.photoURL,
    auth.uid,
    authError,
    authStateChanged,
    clean,
    firebaseApp,
    reauthenticateUser,
    values,
  ])

  const handleClose = useCallback(() => {
    setSimpleValue('delete_user', false)
    setDialogIsOpen('auth_menu', false)
  }, [setDialogIsOpen, setSimpleValue])

  // const handleNotificationsClose = useCallback(() => {
  //   setSimpleValue('disable_notifications', false)
  // }, [setSimpleValue])

  const handleDelete = useCallback(() => {
    reauthenticateUser(false, () => {
      firebaseApp
        .auth()
        .currentUser.delete()
        .then(
          () => {
            handleClose()
          },
          e => {
            authError(e)

            if (e.code === 'auth/requires-recent-login') {
              firebaseApp
                .auth()
                .signOut()
                .then(() => {
                  setTimeout(() => {
                    alert('Please sign in again to delete your account.')
                  }, 1)
                })
            }
          }
        )
    })
  }, [authError, firebaseApp, handleClose, reauthenticateUser])

  const canSave = useCallback(() => {
    if (Object.keys(errors).length) {
      return false
    }

    if (
      values.displayName !== auth.displayName ||
      values.email !== auth.email ||
      values.photoURL !== auth.photoURL
    ) {
      return true
    }

    if (values.newPassword) {
      return true
    }

    return false
  }, [
    auth.displayName,
    auth.email,
    auth.photoURL,
    errors,
    values.displayName,
    values.email,
    values.newPassword,
    values.photoURL,
  ])

  useEffect(() => {
    watchList(`notification_tokens/${auth.uid}`)
    watchPath(`email_notifications/${auth.uid}`)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDisableNotifications = useCallback(() => {
    firebaseApp
      .database()
      .ref(`disable_notifications/${auth.uid}`)
      .set(true)
      .then(() => {
        firebaseApp
          .database()
          .ref(`notification_tokens/${auth.uid}`)
          .remove()
          .then(() => {
            setSimpleValue('disable_notifications', false)
          })
      })
  }, [auth.uid, firebaseApp, setSimpleValue])

  const handleEnableNotificationsChange = useCallback(
    e => {
      if (!e.target.checked) {
        setSimpleValue('disable_notifications', true)
      } else {
        firebaseApp
          .database()
          .ref(`disable_notifications/${auth.uid}`)
          .remove(() => {
            requestNotificationPermission(props)
            // eslint-disable-next-line no-self-assign
            window.location.href = window.location.href
          })
      }
    },
    [auth.uid, firebaseApp, props, setSimpleValue]
  )

  const handleEmailNotification = useCallback(
    async e => {
      await firebaseApp
        .database()
        .ref(`email_notifications/${auth.uid}`)
        .set(e.target.checked)
    },
    [auth.uid, firebaseApp]
  )

  const showPasswords = useMemo(() => isLinkedWithProvider('password'), [
    isLinkedWithProvider,
  ])

  return (
    <Activity
      iconStyleRight={{ width: '50%' }}
      appBarContent={
        <div style={{ display: 'flex' }}>
          {auth.uid && (
            <IconButton
              color="inherit"
              disabled={!canSave()}
              aria-label="open drawer"
              onClick={() => {
                submit()
              }}
            >
              <Save className="material-icons" />
            </IconButton>
          )}

          {auth.uid && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setSimpleValue('delete_user', true)}
            >
              <Delete className="material-icons" />
            </IconButton>
          )}
        </div>
      }
      title={intl.formatMessage({ id: 'my_account' })}
    >
      <div>
        {auth.uid && (
          <div
            style={{
              margin: 15,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {values.photoURL ? (
                <Avatar
                  src={values.photoURL}
                  className={classNames(classes.avatar, classes.bigAvatar)}
                />
              ) : (
                <Avatar
                  alt={values.displayName}
                  className={classNames(classes.avatar, classes.bigAvatar)}
                >
                  <Person style={{ fontSize: 60 }} />{' '}
                </Avatar>
              )}

              <IconButton
                color="primary"
                onClick={() => {
                  setIsPhotoDialogOpen(true)
                }}
              >
                <PhotoCamera />
              </IconButton>

              <div>
                {appConfig.firebase_providers.map((p, i) => {
                  if (p !== 'email' && p !== 'password' && p !== 'phone') {
                    return (
                      <IconButton
                        key={i}
                        disabled={isLinkedWithProvider(p)}
                        color="primary"
                        onClick={() => {
                          linkUserWithPopup(p)
                        }}
                      >
                        {getProviderIcon(p)}
                      </IconButton>
                    )
                  } else {
                    return <div key={i} />
                  }
                })}
              </div>

              <div>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationTokens.length > 0}
                        onChange={handleEnableNotificationsChange}
                        value="pushNotifiction"
                      />
                    }
                    label={intl.formatMessage({ id: 'notifications' })}
                  />
                </FormGroup>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailNotifications === true}
                        onChange={handleEmailNotification}
                        value="emailNotifications"
                      />
                    }
                    label={intl.formatMessage({ id: 'email_notifications' })}
                  />
                </FormGroup>
              </div>
            </div>

            <div
              style={{ margin: 15, display: 'flex', flexDirection: 'column' }}
            >
              <FormControl
                className={classNames(classes.margin, classes.textField)}
                error={!!errors.displayName}
              >
                <InputLabel htmlFor="adornment-password">
                  {intl.formatMessage({ id: 'name_label' })}
                </InputLabel>
                <Input
                  id="displayName"
                  fullWidth
                  value={values.displayName}
                  placeholder={intl.formatMessage({ id: 'name_hint' })}
                  onChange={e => {
                    updateValue('displayName', e.target.value)
                  }}
                />
                {errors.displayName && (
                  <FormHelperText id="name-helper-text">
                    {errors.displayName}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                className={classNames(classes.margin, classes.textField)}
                error={!!errors.email}
              >
                <InputLabel htmlFor="adornment-password">
                  {intl.formatMessage({ id: 'email' })}
                </InputLabel>
                <Input
                  //id="email"
                  label="Email"
                  autoComplete="off"
                  placeholder={intl.formatMessage({ id: 'email' })}
                  fullWidth
                  onChange={e => {
                    updateValue('email', e.target.value)
                  }}
                  value={values.email}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={
                          auth.emailVerified === true
                            ? undefined
                            : handleEmailVerificationsSend
                        }
                      >
                        {auth.emailVerified && <VerifiedUser color="primary" />}
                        {!auth.emailVerified && <Error color="secondary" />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {errors.email && (
                  <FormHelperText id="name-helper-text">
                    {errors.email}
                  </FormHelperText>
                )}
              </FormControl>

              {showPasswords && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <FormControl
                    className={classNames(classes.margin, classes.textField)}
                    error={!!errors.password}
                  >
                    <InputLabel htmlFor="adornment-password">
                      {intl.formatMessage({ id: 'password' })}
                    </InputLabel>
                    <Input
                      autoComplete="off"
                      type={showPassword ? 'text' : 'password'}
                      value={values.password}
                      onChange={e => {
                        updateValue('password', e.target.value)
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            aria-label="Toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors.password && (
                      <FormHelperText id="name-helper-text">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl
                    className={classNames(classes.margin, classes.textField)}
                    error={!!errors.newPassword}
                  >
                    <InputLabel htmlFor="adornment-password">
                      {intl.formatMessage({ id: 'new_password' })}
                    </InputLabel>
                    <Input
                      autoComplete="off"
                      type={showNewPassword ? 'text' : 'password'}
                      value={values.newPassword}
                      onChange={e => {
                        updateValue('newPassword', e.target.value)
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            aria-label="Toggle password visibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors.newPassword && (
                      <FormHelperText id="name-helper-text">
                        {errors.newPassword}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl
                    className={classNames(classes.margin, classes.textField)}
                    error={!!errors.confirmPassword}
                  >
                    <InputLabel htmlFor="adornment-password">
                      {intl.formatMessage({ id: 'confirm_password' })}
                    </InputLabel>
                    <Input
                      autoComplete="off"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={values.confirmPassword}
                      onChange={e => {
                        updateValue('confirmPassword', e.target.value)
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            color="primary"
                            aria-label="Toggle password visibility"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors.confirmPassword && (
                      <FormHelperText id="name-helper-text">
                        {errors.confirmPassword}
                      </FormHelperText>
                    )}
                  </FormControl>
                </div>
              )}
            </div>
          </div>
        )}

        <QuestionDialog
          name="delete_user"
          handleAction={handleDelete}
          title={intl.formatMessage({ id: 'delete_account_dialog_title' })}
          message={intl.formatMessage({
            id: 'delete_account_dialog_message',
          })}
          action={intl.formatMessage({ id: 'delete' })}
        />

        <QuestionDialog
          name="disable_notifications"
          handleAction={handleDisableNotifications}
          title={intl.formatMessage({
            id: 'disable_notifications_dialog_title',
          })}
          message={intl.formatMessage({
            id: 'disable_notifications_dialog_message',
          })}
          action={intl.formatMessage({ id: 'disable' })}
        />

        <ImageCropDialog
          path={`users/${auth.uid}`}
          fileName={'photoURL'}
          onUploadSuccess={handlePhotoUploadSuccess}
          open={isPhotoDialogOpen}
          src={new_user_photo}
          handleClose={() => {
            setIsPhotoDialogOpen(false)
          }}
          title={intl.formatMessage({ id: 'change_photo' })}
        />
      </div>
    </Activity>
  )
}

MyAccount.propTypes = {
  appConfig: PropTypes.shape({
    firebase_providers: PropTypes.array,
  }),
  auth: PropTypes.shape({
    displayName: PropTypes.any,
    email: PropTypes.string,
    emailVerified: PropTypes.bool,
    photoURL: PropTypes.any,
    providerData: PropTypes.array,
    uid: PropTypes.any,
  }),
  authError: PropTypes.func,
  authStateChanged: PropTypes.func,
  classes: PropTypes.shape({
    avatar: PropTypes.any,
    bigAvatar: PropTypes.any,
    margin: PropTypes.any,
    textField: PropTypes.any,
  }),
  emailNotifications: PropTypes.any,
  firebaseApp: PropTypes.shape({
    auth: PropTypes.func,
    database: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  new_user_photo: PropTypes.any,
  notificationTokens: PropTypes.array,
  setDialogIsOpen: PropTypes.func,
  setSimpleValue: PropTypes.func,
  watchList: PropTypes.func,
  watchPath: PropTypes.func,
}

const selector = formValueSelector(form_name)

const mapStateToProps = state => {
  const { intl, simpleValues, auth, messaging } = state

  const delete_user = simpleValues.delete_user
  const disable_notifications = simpleValues.disable_notifications
  const new_user_photo = simpleValues.new_user_photo

  return {
    new_user_photo,
    intl,
    delete_user,
    disable_notifications,
    auth,
    messaging,
    photoURL: selector(state, 'photoURL'),
    old_password: selector(state, 'old_password'),
    notificationTokens: getList(state, `notification_tokens/${auth.uid}`),
    emailNotifications: getPath(state, `email_notifications/${auth.uid}`),
    simpleValues,
  }
}

export default compose(
  connect(mapStateToProps, {
    setSimpleValue,
    change,
    submit,
    setDialogIsOpen,
    setPersistentValue,
  }),
  injectIntl,
  withRouter,
  withTheme,
  withFirebase,
  withAppConfigs,
  withStyles(styles, { withTheme: true })
)(MyAccount)
