import Activity from '../../containers/Activity'
import DeleteDialog from '../../containers/DeleteDialog'
import FireForm from '../../containers/FireForm/FireForm'
import Save from '@material-ui/icons/Save'
import Delete from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Scrollbar from '../../components/Scrollbar'
import Tooltip from '@material-ui/core/Tooltip'
import isGranted from '../../utils/auth'
import { change, submit } from 'redux-form'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

class EditDocumentActivity extends Component {
  _handleDelete = async handleClose => {
    const { history, match, firebaseApp, path } = this.props
    const uid = match.params.uid

    if (uid) {
      await firebaseApp.firestore().doc(`/${path}/${uid}`).delete()
      handleClose()
      history.goBack()
    }
  }

  hanldeSubmitSuccess = () => {
    const { history, path } = this.props
    history.push(`/${path}`)
  }

  render() {
    const {
      history,
      setSimpleValue,
      intl,
      submit,
      match,
      isGranted,
      firebaseApp,
      children,
      fireFormProps,
      handleDelete,
      name,
      path,
    } = this.props

    const uid = match.params.uid

    return (
      <Activity
        title={intl.formatMessage({
          id: this.props.match.params.uid ? `edit_${name}` : `create_${name}`,
        })}
        appBarContent={
          <div style={{ display: 'flex' }}>
            {((uid !== undefined && isGranted(`edit_${name}`)) ||
              (uid === undefined && isGranted(`create_${name}`))) && (
              <Tooltip title={intl.formatMessage({ id: 'save' })}>
                <IconButton
                  color="inherit"
                  aria-label="save"
                  onClick={() => {
                    submit(name)
                  }}
                >
                  <Save />
                </IconButton>
              </Tooltip>
            )}
            {uid && isGranted(`delete_${name}`) && (
              <Tooltip title={intl.formatMessage({ id: 'delete' })}>
                <IconButton
                  color="inherit"
                  aria-label="delete"
                  onClick={() => {
                    setSimpleValue(`delete_${name}`, true)
                  }}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </div>
        }
        onBackClick={() => {
          history.goBack()
        }}
      >
        <Scrollbar style={{ height: 'calc(100vh - 112px)' }}>
          <div style={{ margin: 15, display: 'flex' }}>
            <FireForm
              useFirestore={true}
              firebaseApp={firebaseApp}
              name={name}
              path={path}
              uid={match.params.uid}
              onSubmitSuccess={this.hanldeSubmitSuccess}
              {...fireFormProps}
            >
              {children}
            </FireForm>
          </div>
        </Scrollbar>

        <DeleteDialog
          name={name}
          handleDelete={handleDelete ? handleDelete : this._handleDelete}
        />
      </Activity>
    )
  }
}

EditDocumentActivity.propTypes = {
  children: PropTypes.any,
  fireFormProps: PropTypes.any,
  firebaseApp: PropTypes.shape({
    firestore: PropTypes.func,
  }),
  handleDelete: PropTypes.any,
  history: PropTypes.shape({
    goBack: PropTypes.func,
    push: PropTypes.func,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  isGranted: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      uid: PropTypes.func,
    }),
  }),
  name: PropTypes.any,
  path: PropTypes.any,
  setSimpleValue: PropTypes.func,
  submit: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const { auth, intl } = state
  const { isGranted: customIsGranted } = ownProps

  return {
    auth,
    intl,
    isGranted: grant =>
      customIsGranted ? customIsGranted(state, grant) : isGranted(state, grant),
  }
}

export default compose(
  connect(mapStateToProps, { setSimpleValue, change, submit }),
  injectIntl,
  withRouter,
  withFirebase,
  withTheme
)(EditDocumentActivity)
