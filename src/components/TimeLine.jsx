import React from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import NoteList from './NoteList'
import Card from '@material-ui/core/Card'
import { groupByDay } from '../general/helperFunctions'
import NewNote from './NewNote'
import { List } from '@material-ui/core'

const styles = {
  root: {
    width: 600,
    margin: 'auto'
  },
  day: {
    marginBottom: '1em'
  }
}

const getDayString = date =>
  new Date(date).toLocaleDateString('en', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

const TimelineLoadedView = ({
  notes = [],
  classes,
  onAddNote
}) => {
  const { days, notesByDay } = groupByDay(notes)

  if (days.length === 0) {
    return (
      <Typography color='error'>
                Error: This list should not be empty.
      </Typography>
    )
  }
  return (
    <div className={classes.root}>
      {days.map(day => (
        <div key={day} className={classes.day}>
          <Typography variant='subtitle1' gutterBottom>
            {getDayString(day)}
          </Typography>
          <NoteList notes={notesByDay[day]} />
        </div>
      ))}
      <NewNote onAddNote={onAddNote} />
    </div>
  )
}

const TimelineLoaded = withStyles(styles)(TimelineLoadedView)

export default TimelineLoaded
