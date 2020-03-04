import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import { withStyles } from '@material-ui/core/styles'
import Avatar from './Avatar'

const styles = {
  truncate: {
    width: 500,
    textOverflow: 'ellipsis'
  }
}

const EventItemView = ({ note, classes }) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar user={null} />
    </ListItemAvatar>
    <ListItemText
      primary={
        <div className={classes.truncate}>
          <strong>
            {note.user ? note.user.lastName + note.user.firstName : 'Anonymous'}
          </strong>{' '}
          {note.text}
        </div>
      }
      secondary={new Date(note.time).toLocaleString()}
    />
  </ListItem>
)

const EventItem = withStyles(styles)(EventItemView)

export default EventItem
