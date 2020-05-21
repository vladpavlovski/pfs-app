import PropTypes from 'prop-types'
import React from 'react'
import MUISwitch from '@material-ui/core/Switch'

const Switch = ({ input, ...custom }) => (
  <MUISwitch checked={!!input.value} {...input} {...custom} />
)

Switch.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.any,
  }),
}

export default Switch
