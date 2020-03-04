import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { WordIcon } from './Icons'
import { ListItemIcon, IconButton, Tooltip, Link } from '@material-ui/core'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import DeleteIcon from '@material-ui/icons/Delete'
import { baseURL } from '../general/constants'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: 'inline'
  }
}))

const filesURL = baseURL + 'files/'

export default function AttachmentList ({ attachments, deleteAttachment, caseID }) {
  const classes = useStyles()

  return (
    <List className={classes.root}>
      {attachments.map((attachment, index) =>
        <Fragment key={index}>
          <ListItem alignItems='flex-start'>
            <ListItemIcon>
              <WordIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Link href={filesURL + caseID + '/' + attachment.filename}> {attachment.filename}</Link>}
              secondary={
                <>
                  <Typography
                    component='span'
                    variant='body2'
                    className={classes.inline}
                    color='textPrimary'
                  >
                    {attachment.user.lastName + ' ' + attachment.user.firstName}
                  </Typography>
                  {` στις ${new Date(attachment.addedOn).toLocaleString()}`}
                </>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title='Διαγραφή αρχείου'>
                <IconButton edge='end' onClick={() => deleteAttachment(attachment)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </Fragment>
      )}
    </List>
  )
}
