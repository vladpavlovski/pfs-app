import PropTypes from 'prop-types'
import 'firebase/storage'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import CloseIcon from '@material-ui/icons/Close'
import Dialog from '@material-ui/core/Dialog'
import Dropzone from 'react-dropzone'
import IconButton from '@material-ui/core/IconButton'
import React, { useState, useCallback, useRef } from 'react'
import Slide from '@material-ui/core/Slide'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import firebase from 'firebase/app'
import { Cropper } from 'react-image-cropper'
import { compose } from 'redux'
import { injectIntl } from 'react-intl'
import { withFirebase } from 'firekit-provider'
import { withTheme } from '@material-ui/core/styles'

const Transition = props => <Slide direction="up" {...props} />

const ImageCropDialog = props => {
  const {
    path,
    fileName,
    onUploadSuccess,
    firebaseApp,
    handleClose,
    intl,
    open,
    title,
    theme,
    cropperProps,
  } = props
  const [src, setSrc] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const cropper = useRef()
  const [file, setFile] = useState(null)

  const handlePhotoURLUpload = useCallback(
    photo_url => {
      setIsUploading(true)

      let uploadTask = firebaseApp
        .storage()
        .ref(`${path}/${fileName}`)
        .putString(photo_url, 'data_url')

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(progress)
        },
        error => {
          console.log(error)
        },
        () => {
          setUploadProgress(100)
          setSrc(null)
          setIsUploading(false)
          onUploadSuccess(uploadTask.snapshot)
        }
      )
    },
    [fileName, firebaseApp, onUploadSuccess, path]
  )

  const handlePhotoULRChange = useCallback(files => {
    const reader = new FileReader()
    reader.onload = () => {
      setSrc(reader.result)
      setFile(files[0])
    }
    reader.readAsDataURL(files[0])
  }, [])

  const handleCloseInner = useCallback(() => {
    setSrc(null)
    handleClose()
  }, [handleClose])

  return (
    <Dialog
      fullScreen
      TransitionComponent={Transition}
      open={open}
      onClose={handleCloseInner}
      aria-labelledby="responsive-dialog-title"
    >
      <AppBar style={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseInner}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography
            style={{ marginLeft: theme.spacing(2), flex: 1 }}
            variant="h6"
          >
            {title}
          </Typography>
          <Button
            color="inherit"
            disabled={!src || isUploading}
            onClick={() => {
              handlePhotoURLUpload(cropper.current.crop())
            }}
          >
            {intl.formatMessage({ id: 'save' })}
          </Button>
        </Toolbar>
      </AppBar>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {!src && !isUploading && (
          <Dropzone onDrop={handlePhotoULRChange}>
            {({ getRootProps, getInputProps }) => {
              return (
                <div
                  {...getRootProps()}
                  style={
                    src
                      ? undefined
                      : {
                          height: '50vh',
                          width: '50vw',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderStyle: 'dashed',
                          borderColor: theme.palette.secondary.main,
                        }
                  }
                >
                  <input {...getInputProps()} />
                  <Typography>
                    {src
                      ? file.name
                      : intl.formatMessage({
                          id: 'drop_or_select_file_label',
                        })}
                  </Typography>
                </div>
              )
            }}
          </Dropzone>
        )}

        {isUploading && (
          <div>
            <CircularProgress
              variant="static"
              value={uploadProgress}
              style={{ width: 200, height: 200 }}
              size={50}
              thickness={20}
            />
          </div>
        )}

        {src && !isUploading && (
          <div style={{ maxWidth: '80vw', maxHeight: '80vh' }}>
            <Cropper
              ref={cropper}
              src={src}
              aspectRatio={9 / 9}
              {...cropperProps}
            />
          </div>
        )}
      </div>
    </Dialog>
  )
}

ImageCropDialog.propTypes = {
  cropperProps: PropTypes.any,
  fileName: PropTypes.any,
  firebaseApp: PropTypes.shape({
    storage: PropTypes.func,
  }),
  handleClose: PropTypes.func,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  onUploadSuccess: PropTypes.func,
  open: PropTypes.any,
  path: PropTypes.any,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      secondary: PropTypes.shape({
        main: PropTypes.any,
      }),
    }),
    spacing: PropTypes.func,
  }),
  title: PropTypes.any,
}

export default compose(withFirebase, withTheme, injectIntl)(ImageCropDialog)
