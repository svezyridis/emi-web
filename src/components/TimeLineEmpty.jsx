import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import InfoIcon from '@material-ui/icons/Info'
import List from '@material-ui/core/List'
import { withStyles } from '@material-ui/core/styles'
import NewNote from './NewNote'
import { Grid } from '@material-ui/core'

const styles = {
  root: {
    width: 600,
    margin: 'auto',
    height: 50
  },
  content: {
    display: 'flex'
  },
  icon: {
    width: 50,
    height: 50,
    paddingRight: '1em'
  },
  newNote: {
    marginTop: '10px',
    width: 600,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}

const TimelineEmptyView = ({ classes, onAddNote }) => (
  <>
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Grid container spacing={3}>
          <Grid item>
            <InfoIcon color='primary' />
          </Grid>
          <Grid item>
            <Typography variant='body2'>
                    Δεν υπάρχουν σημειώσεις για αυτήν την υπόθεση
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
    <div className={classes.newNote}>
      <NewNote onAddNote={onAddNote} />
    </div>

  </>

)

const TimelineEmpty = withStyles(styles)(TimelineEmptyView)

export default TimelineEmpty
