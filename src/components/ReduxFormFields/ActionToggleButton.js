import PropTypes from 'prop-types'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'

const ActionToggleButton = props => {
  const { isToggled, getIcon, onClick, input, ...rest } = props
  const { value } = input
  const checked = isToggled(value)

  return (
    <IconButton onClick={() => onClick(checked)} {...rest}>
      {getIcon(checked)}
    </IconButton>
  )
}

ActionToggleButton.propTypes = {
  getIcon: PropTypes.func,
  input: PropTypes.any,
  isToggled: PropTypes.func,
  onClick: PropTypes.func,
}

export default ActionToggleButton
