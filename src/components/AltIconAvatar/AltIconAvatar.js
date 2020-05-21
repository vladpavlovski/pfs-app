import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import React from 'react'

const AltIconAvatar = props => {
  const { src, icon, ...rest } = props

  if (src) {
    return (
      <ListItemAvatar>
        <Avatar src={src} {...rest} />
      </ListItemAvatar>
    )
  } else {
    return (
      <ListItemAvatar>
        <Avatar {...rest}>{icon}</Avatar>
      </ListItemAvatar>
    )
  }
}

AltIconAvatar.propTypes = {
  icon: PropTypes.any,
  src: PropTypes.any,
}

export default AltIconAvatar
