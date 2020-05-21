import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import Slide from '@material-ui/core/Slide'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { setSimpleValue } from '../../store/simpleValues/actions'
import getSimpleValue from '../../store/simpleValues/selectors'

const Transition = props => <Slide direction="up" {...props} />

const QuestionDialog = props => {
  const {
    name,
    setSimpleValue,
    onCloseAction,
    intl,
    isDialogOpen,
    handleAction,
    fullScreen,
    title = '',
    message = '',
    action = '',
  } = props
  const handleClose = useCallback(() => {
    if (onCloseAction) {
      onCloseAction()
    }
    setSimpleValue(name, undefined)
  }, [name, onCloseAction, setSimpleValue])

  return (
    isDialogOpen && (
      <Dialog
        fullScreen={fullScreen}
        open={isDialogOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {intl.formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            onClick={() => {
              handleAction(handleClose)
            }}
            color="secondary"
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    )
  )
}

const mapStateToProps = (state, ownProps) => {
  const { name } = ownProps
  const isDialogOpen = getSimpleValue(state, name, false)

  return {
    isDialogOpen,
  }
}

QuestionDialog.propTypes = {
  action: PropTypes.string,
  fullScreen: PropTypes.any,
  handleAction: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  isDialogOpen: PropTypes.any,
  message: PropTypes.string,
  name: PropTypes.any,
  onCloseAction: PropTypes.func,
  setSimpleValue: PropTypes.func,
  title: PropTypes.string,
}

export default compose(
  connect(mapStateToProps, { setSimpleValue }),
  withMobileDialog(),
  injectIntl
)(QuestionDialog)
