import PropTypes from 'prop-types'
import React from 'react'
import { FreeAutocomplete } from 'muishift'

const FormFreeAutocomplete = props => {
  const {
    label,
    input,
    meta: { touched, invalid, error },
    ...custom
  } = props

  return (
    <FreeAutocomplete
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      selectedItem={input.value}
      {...custom}
      {...input}
    />
  )
}

FormFreeAutocomplete.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.any,
  }),
  label: PropTypes.any,
  meta: PropTypes.object,
}

export default FormFreeAutocomplete
