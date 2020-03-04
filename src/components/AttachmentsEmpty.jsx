import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import InfoIcon from '@material-ui/icons/Info'
import { withStyles } from '@material-ui/core/styles'
import NewNote from './NewNote'
import { Grid } from '@material-ui/core'

const styles = {
  root: {
    width: 400,
    margin: 'auto'
  },
  content: {
    display: 'flex'
  },
  icon: {
    width: 50,
    height: 50,
    paddingRight: '1em'
  },
  text: {
    maxWidth: 300
  }
}

const AttachmentsEmptyView = ({ classes, onAddNote }) => (
  <Card className={classes.root}>
    <CardContent className={classes.content}>
      <Grid container spacing={3}>
        <Grid item>
          <InfoIcon color='primary' />
        </Grid>
        <Grid item>
          <Typography variant='body2' className={classes.text}>
            Δεν υπάρχουν συνημμένα αρχεία για αυτήν την υπόθεση
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)

const AttachmentsEmpty = withStyles(styles)(AttachmentsEmptyView)

export default AttachmentsEmpty
