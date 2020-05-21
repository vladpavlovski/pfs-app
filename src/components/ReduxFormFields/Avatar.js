import PropTypes from 'prop-types'
import React from 'react'
import AltIconAvatar from '../../components/AltIconAvatar'

const Avatar = ({ input, ...custom }) => {
  return (
    <AltIconAvatar
      src={input ? input.value : undefined}
      {...input}
      {...custom}
    />
  )
}

Avatar.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.any,
  }),
  label: PropTypes.any,
}

export default Avatar
