import PropTypes from 'prop-types'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

const ToggleButton = props => {
  const { input, checkedIcon, uncheckedIcon, tooltip = '', ...rest } = props
  const { value, onChange } = input
  const isToggled = value === true

  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={() => onChange(!isToggled)} {...rest}>
        {isToggled && checkedIcon}
        {!isToggled && uncheckedIcon}
      </IconButton>
    </Tooltip>
  )
}

ToggleButton.propTypes = {
  checkedIcon: PropTypes.any,
  input: PropTypes.any,
  tooltip: PropTypes.string,
  uncheckedIcon: PropTypes.any,
}

export default ToggleButton
