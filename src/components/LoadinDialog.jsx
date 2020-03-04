import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import DialogContentText from '@material-ui/core/DialogContentText'
import Grow from '@material-ui/core/Grow'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/styles'

const dialogStyle = makeStyles(theme => ({
  cricle: {
    marginLeft: '47%'
  }
}))

const LoadingDialog = ({ reason, open, dark }) => {
  const classes = dialogStyle()
  return (
    <Dialog
      TransitionComponent={Grow}
      keepMounted
      closeAfterTransition
      disableBackdropClick
      disableEscapeKeyDown
      fullWidth
      maxWidth='sm'
      open={open}
    >
      <DialogTitle disableTypography>
        <Typography
          color={dark ? 'secondary' : 'primary'}
          variant='h4'
          align='center'
        >
          Loading
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText color='textPrimary' align='center'>
          {reason.toString()}
        </DialogContentText>
        <CircularProgress
          color={dark ? 'secondary' : 'primary'}
          className={classes.cricle}
        />
      </DialogContent>
    </Dialog>
  )
}

LoadingDialog.propTypes = {
  reason: PropTypes.string.isRequired
}

export default LoadingDialog
