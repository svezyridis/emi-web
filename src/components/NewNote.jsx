import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Avatar from './Avatar'
import { TextField, Tooltip, Grid, Fab, Card } from '@material-ui/core'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import { baseURL } from '../general/constants'

const styles = {
  truncate: {
    width: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  note: {
    width: 490
  }
}

const NewNoteView = ({ classes, onAddNote }) => {
  const [note, setNote] = useState('')
  return (
    <Card className={classes.newNote}>
      <Grid container alignItems='center' justify='space-around'>
        <Grid item>
          <Avatar user={null} />
        </Grid>
        <Grid item>
          <div className={classes.truncate}>
            <TextField
              placeholder='Προσθήκη σημείωσης'
              className={classes.note}
              multiline
              rowsMax='4'
              value={note}
              fullWidth
              onChange={event => setNote(event.target.value)}
            />
          </div>
        </Grid>
        <Grid item>
          <Tooltip title='Προσθήκη σημείωσης'>
            <Fab
              size='small' onClick={() => {
                setNote('')
                onAddNote(note)
              }}
            >
              <NoteAddIcon />
            </Fab>
          </Tooltip>
        </Grid>

      </Grid>
    </Card>

  )
}

const NewNote = withStyles(styles)(NewNoteView)

export default NewNote
