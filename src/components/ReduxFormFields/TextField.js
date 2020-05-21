import PropTypes from 'prop-types'
import React from 'react'
import MUITextField from '@material-ui/core/TextField'

const TextField = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}) => (
  <MUITextField
    label={label}
    placeholder={label}
    error={touched && invalid}
    helperText={touched && error}
    {...input}
    {...custom}
  />
)

TextField.propTypes = {
  input: PropTypes.any,
  label: PropTypes.any,
  meta: PropTypes.object,
}

export default TextField
