import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle'
import PeopleIcon from '@material-ui/icons/People'
import { connect } from 'react-redux'
import { newAccount, deleteAccount } from '../store/actions'
import isEmpty from 'lodash.isempty'
import { useHistory } from 'react-router-dom'
import { Button, Grid, SvgIcon, Paper, Fab, Input, Tooltip } from '@material-ui/core'
import { fetch } from 'whatwg-fetch'
import { baseURL } from '../general/constants'
import useStyles from '../styles'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import { objectToQueryString } from '../general/helperFunctions'
import TimelineLoaded from './TimeLine'
import TimelineLoading from './TImeLineLoading'
import TimelineEmpty from './TimeLineEmpty'
import { WordIcon } from './Icons'
import AttachmentsEmpty from './AttachmentsEmpty'
import AttachmentsList from './AttachmentList'
import LoadingDialog from './LoadinDialog'

function Copyright () {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://ypotheseis.com/'>
          ypotheseis.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const casesURL = baseURL + 'cases/'
const notesURL = baseURL + 'notes/'
const filesURL = baseURL + 'files/'

function Case ({ deleteAccount, account, location, match }) {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const [error, setError] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [remainingFile, setRemainingFile] = useState(0)
  const [files, setFiles] = useState([])
  const [myCase, setMyCase] = useState({})
  const history = useHistory()
  const controller = new window.AbortController()
  const signal = controller.signal
  const folderNumber = match.params.folderNumber
  const inputRef = useRef()

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const postFiles = () => {
    let { length, ...fileList } = { ...files }
    length = files.length
    setRemainingFile(length)
    Object.values(fileList).forEach(async file => {
      console.log(file)
      const formData = new window.FormData()
      formData.append('file', file)
      try {
        const response = await fetch(
          filesURL + myCase.id,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json'
            },
            body: formData
          }
        )
        const data = await response.json()
        length--
        setRemainingFile(length)
        if (length === 0) {
          getCase(myCase.id)
          setFiles([])
        }
        console.log(data)
      } catch (error) {
        length--
        setRemainingFile(length)
        if (length === 0) {
          getCase(myCase.id)
          setFiles([])
        }
        console.error(error)
      }
    })
  }

  const onDelete = (attachment) => console.log(attachment)
  const getAttachment = (attachment) => {
    fetch(filesURL + myCase.id + '/' + attachment.filename, {
      method: 'GET',
      credentials: 'include',
      signal: signal
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else throw Error(`Request rejected with status ${response.status}`)
      })
      .then(data => {
        const { status, result, message } = data
        console.log(data)
        if (status === 'error') {
          setReason('')
          setError(message)
        } else {
          setMyCase(result)
          setReason('')
        }
      })
      .catch(error => {
        setReason('')
        if (!controller.signal.aborted) {
          console.error(error)
        }
      })
  }

  const getCase = (caseID) => {
    setReason('Γίνεται λήψη υπόθεσης')
    fetch(casesURL + objectToQueryString({ caseID: caseID }), {
      method: 'GET',
      credentials: 'include',
      signal: signal
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else throw Error(`Request rejected with status ${response.status}`)
      })
      .then(data => {
        const { status, result, message } = data
        console.log(data)
        if (status === 'error') {
          setReason('')
          setError(message)
        } else {
          setMyCase(result)
          setReason('')
        }
      })
      .catch(error => {
        setReason('')
        if (!controller.signal.aborted) {
          console.error(error)
        }
      })
  }

  useEffect(() => {
    if (isEmpty(account)) {
      return
    }
    if (!location.state) {
      return
    }
    const caseID = location.state.case.id
    getCase(caseID)
    return () => {
      controller.abort()
    }
  }, [])

  if (isEmpty(account)) {
    history.push('/login')
    return null
  }
  const isManager = account.metadata.role === 'MANAGER'

  if (!location.state) {
    history.push('/cases')
    return null
  }
  const currentCase = location.state.case
  const caseID = currentCase.id

  const addNote = (note) => {
    fetch(notesURL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ text: note, caseID: caseID, userID: account.metadata.id }),
      signal: signal
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        } else throw Error(`Request rejected with status ${response.status}`)
      })
      .then(data => {
        const { status, message } = data
        if (status === 'error') {
          setError(message)
        } else {
          getCase(caseID)
        }
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          console.error(error)
        }
      })
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <LoadingDialog
        open={remainingFile > 0}
        reason={`Απομένουν ${remainingFile} αρχεία`}
      />
      <LoadingDialog open={reason !== ''} reason={reason} />
      <AppBar position='absolute' className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component='h1' variant='h6' color='inherit' noWrap className={classes.title}>
            {folderNumber}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <Typography align='center' variant='h5'>
          {open ? account.metadata.lastName + ' ' + account.metadata.firstName : null}
        </Typography>
        <List>
          <div>
            <ListItem button onClick={() => history.push('/')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary='Οι υποθέσεις μου' />
            </ListItem>
            <ListItem button onClick={() => history.push('/cases')}>
              <ListItemIcon>
                <LibraryBooksIcon />
              </ListItemIcon>
              <ListItemText primary='Αρχείο' />
            </ListItem>
            <ListItem button onClick={() => history.push('/clients')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary='Πελάτες' />
            </ListItem>
            {isManager ? <ListItem button onClick={() => history.push('/users')}>
              <ListItemIcon>
                <SupervisedUserCircleIcon />
              </ListItemIcon>
              <ListItemText primary='Διαχείριση χρηστών' />
                         </ListItem> : null}
          </div>
        </List>
        <Divider />
        {open ? <Button variant='contained' size='medium' color='secondary' className={classes.logout} onClick={() => deleteAccount()}>ΕΞΟΔΟΣ</Button> : null}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={3}>
            <Grid item>
              <Typography align='center' variant='h5'> Σημειώσεις</Typography>
              {loading ? <TimelineLoading /> : isEmpty(myCase.notes) ? <TimelineEmpty onAddNote={addNote} /> : <TimelineLoaded notes={myCase.notes} onAddNote={addNote} />}
            </Grid>
            <Grid item>
              <Grid container direction='column' spacing={2} justify='flex-end'>
                <Grid item>
                  <Typography align='center' variant='h5'> Συννημένα αρχεία</Typography>
                  <Paper elevation={3} className={classes.attachments}>
                    {!isEmpty(myCase) ? myCase.attachments.length === 0 ? <AttachmentsEmpty /> : <AttachmentsList attachments={myCase.attachments} deleteAttachment={onDelete} caseID={myCase.id} /> : null}
                  </Paper>
                </Grid>
                <Grid item>
                  <Grid container justify='flex-end' spacing={2}>
                    <Grid item>
                      {files.length > 0
                        ? <>
                          <Typography variant='subtitle2'>{`Έχετε επιλέξει ${files.length} αρχεία:   `} <Button variant='contained' onClick={postFiles}>ΑΝΕΒΑΜΣΑ</Button></Typography>
                          </> : null}
                    </Grid>
                    <Grid item>
                      <input id='file-upload' type='file' className={classes.inputfile} ref={inputRef} multiple onChange={(e) => setFiles(e.target.files)} />
                      <Tooltip title='Προσθέστε αρχεία'>
                        <Fab onClick={() => inputRef.current.click()}>
                          <AttachFileIcon />
                        </Fab>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
        <div className={classes.footer}>
          <Copyright />
        </div>
      </main>
    </div>
  )
}

export default connect(
  ({ account }) => ({
    account: account
  }),
  dispatch => ({
    addAccount (token) {
      dispatch(newAccount(token))
    },
    deleteAccount () {
      dispatch(deleteAccount())
    }
  })
)(Case)
