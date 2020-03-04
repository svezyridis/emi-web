import React from 'react'
import MuiAvatar from '@material-ui/core/Avatar'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  avatar: {
    width: 25,
    height: 25
  }
}

const AvatarView = ({ user, classes }) => (
  <MuiAvatar
    className={classes.avatar}
    src='https://www.gravatar.com/avatar/?d=mp'
  />
)

const Avatar = withStyles(styles)(AvatarView)

export default Avatar
