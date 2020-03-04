import React from 'react'
import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import { withStyles } from '@material-ui/core/styles'
import NoteItem from './NoteItem'
import NewNote from './NewNote'

const styles = {
  root: {
    width: 600
  }
}

const NoteListView = ({ notes = [], classes }) => (
  <Card className={classes.root}>
    <List>
      {notes.map(note => (
        <NoteItem note={note} key={note.id} />
      ))}
    </List>
  </Card>
)

const NoteList = withStyles(styles)(NoteListView)

export default NoteList
