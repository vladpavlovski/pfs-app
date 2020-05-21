import PropTypes from 'prop-types'
import React from 'react'
import MUICheckbox from '@material-ui/core/Checkbox'

const Checkbox = ({ input, ...custom }) => (
  <MUICheckbox checked={!!input.value} {...input} {...custom} />
)

Checkbox.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.any,
  }),
  label: PropTypes.any,
  meta: PropTypes.object,
}

export default Checkbox
