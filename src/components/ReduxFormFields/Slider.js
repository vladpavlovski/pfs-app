import PropTypes from 'prop-types'
import React from 'react'
import MUISlider from '@material-ui/core/Slider'

const Slider = ({
  input: { onChange, value },
  onChange: onChangeFromField,
  ...custom
}) => {
  return (
    <MUISlider
      value={value}
      {...custom}
      onChange={(event, value) => {
        onChange(value)
        if (onChangeFromField) {
          onChangeFromField(value)
        }
      }}
    />
  )
}

Slider.propTypes = {
  onChange: PropTypes.func,
  input: PropTypes.any,
}

export default Slider
