import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Reorder from '@material-ui/icons/Reorder'
import React, { useState } from 'react'
import { Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

const styles = theme => ({
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
})

const mobileMenuId = 'primary-search-account-menu-mobile'

const ResponsiveMenu = ({
  sections = [],
  classes = {},
  transparent,
  contrastColor = 'white',
}) => {
  const [isOpen, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div
        className={classes.sectionDesktop}
        style={{ color: transparent ? contrastColor : undefined }}
      >
        {sections.map(({ onClick, name, isDivider = false }, i) => {
          if (isDivider) {
            return (
              <Divider
                key={`divider${i}`}
                orientation="vertical"
                flexItem
                style={{
                  margin: 5,
                  backgroundColor: transparent ? contrastColor : null,
                }}
              />
            )
          }

          return (
            <Button
              key={`button_${name}`}
              style={{ margin: 8 }}
              //variant="contained"
              onClick={onClick}
              aria-label={name}
              color="inherit"
            >
              <Typography variant="h6">{name}</Typography>
            </Button>
          )
        })}
      </div>
      <div className={classes.sectionMobile}>
        <IconButton
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleOpen}
          color="inherit"
        >
          <MenuIcon
            style={{ color: transparent ? contrastColor : undefined }}
          />
        </IconButton>
      </div>
      <Drawer anchor="right" open={isOpen} onClose={handleClose}>
        <List>
          <ListItem button key={'0'} onClick={handleClose}>
            <ListItemIcon>
              <ChevronRight />
            </ListItemIcon>
          </ListItem>
          <Divider />
          {sections.map(
            ({ name = '', onClick, icon, isDivider = false }, i) => {
              if (isDivider) {
                return <Divider key={`divider_${i}`} />
              }
              return (
                <ListItem
                  button
                  key={name}
                  onClick={() => {
                    handleClose()
                    setTimeout(onClick, 1)
                  }}
                >
                  <ListItemIcon>{icon || <Reorder />}</ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
              )
            }
          )}
        </List>
      </Drawer>
    </>
  )
}

ResponsiveMenu.propTypes = {
  classes: PropTypes.object,
  contrastColor: PropTypes.string,
  handleMenuClose: PropTypes.any,
  history: PropTypes.any,
  scroll: PropTypes.any,
  sections: PropTypes.array,
  statemobileMoreAnchorEl: PropTypes.any,
  transparent: PropTypes.any,
}

export default withStyles(styles)(ResponsiveMenu)
