import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import { KeyboardTimePicker } from '@material-ui/pickers'

const TimeField = props => {
  const {
    meta = {},
    input: { value, ...inputProps },
    timeFormat,
    ...others
  } = props
  const { submitting, error, touched } = meta

  const handleBlur = e => {
    const value = e.target.value
    if (moment(value, timeFormat).isValid()) {
      inputProps.onBlur(moment(value, timeFormat).format())
    } else {
      inputProps.onBlur(null)
    }
  }

  const onAccept = value => {
    inputProps.onChange(moment(value, timeFormat).format())
  }

  return (
    <KeyboardTimePicker
      placeholder={moment().format(timeFormat)}
      {...inputProps}
      {...others}
      format={timeFormat}
      value={value ? new Date(value) : null}
      disabled={submitting}
      onBlur={handleBlur}
      error={error && touched}
      onAccept={onAccept}
    />
  )
}

TimeField.propTypes = {
  ampm: PropTypes.bool,
  autoOk: PropTypes.bool,
  disableOpenOnEnter: PropTypes.bool,
  keyboard: PropTypes.bool,
  meta: PropTypes.object,
  timeFormat: PropTypes.string,
  input: PropTypes.object,
}

TimeField.defaultProps = {
  ampm: false,
  keyboard: true,
  autoOk: true,
  disableOpenOnEnter: true,
  timeFormat: 'HH:mm',
}

export default TimeField
