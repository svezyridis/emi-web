import React, { useState, useEffect } from 'react'
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
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle'
import { connect } from 'react-redux'
import { newAccount, deleteAccount } from '../store/actions'
import isEmpty from 'lodash.isempty'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Card, CardActions, CardContent } from '@material-ui/core'
import { fetch } from 'whatwg-fetch'
import { baseURL } from '../general/constants'
import find from 'lodash.find'
import useStyles from '../styles'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import { objectToQueryString } from '../general/helperFunctions'

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
const usersURL = baseURL + 'users/'
const clientsURL = baseURL + 'clients/'

function ClientCases ({ deleteAccount, account, match, location }) {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const [error, setError] = useState('')
  const [reason, setReason] = useState('')
  const [cases, setCases] = useState([])
  const [users, setUsers] = useState([])
  const history = useHistory()
  const controller = new window.AbortController()
  const signal = controller.signal
  const clientID = match.params.id

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const getCases = () => {
    setReason('Γίνεται λήψη υποθέσεων')
    fetch(casesURL + objectToQueryString({ clientID: clientID }), {
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
          setCases(result)
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

  const getUsers = () =>
    new Promise((resolve, reject) => {
      fetch(usersURL, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        signal: signal
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else throw Error(`Request rejected with status ${response.status}`)
        })
        .then(data => {
          console.log(data)
          const { status, result, message } = data
          if (status === 'error') {
            setError(message)
          } else {
            setUsers(result)
          }
          resolve()
        })
        .catch(error => {
          if (!controller.signal.aborted) {
            console.error(error)
          }
          resolve()
        })
    })

  const addCase = newCase =>
    new Promise((resolve, reject) => {
      console.log(newCase)
      fetch(casesURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(newCase),
        signal: signal
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else throw Error(`Request rejected with status ${response.status}`)
        })
        .then(data => {
          const { status, message } = data
          console.log(data)
          if (status === 'error') {
            setError(message)
            reject(new Error(message))
          } else {
            getCases()
            resolve()
          }
        })
        .catch(error => {
          if (!controller.signal.aborted) {
            console.error(error)
            reject(new Error(error))
          }
        })
    })

  const updateCase = (newData, oldData) =>
    new Promise((resolve, reject) => {
      console.log(newData)
      if (newData.userID === 0) { delete newData.userID }
      fetch(casesURL + newData.id, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(newData),
        signal: signal
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else throw Error(`Request rejected with status ${response.status}`)
        })
        .then(data => {
          const { status, message } = data
          console.log(data)
          if (status === 'error') {
            setError(message)
            reject(new Error(message))
          } else {
            getCases()
            resolve()
          }
        })
        .catch(error => {
          if (!controller.signal.aborted) {
            console.error(error)
            reject(new Error(error))
          }
        })
    })

  const deleteCase = (caseToDelete) =>
    new Promise((resolve, reject) => {
      console.log(caseToDelete)
      fetch(casesURL + caseToDelete.id, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        signal: signal
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else throw Error(`Request rejected with status ${response.status}`)
        })
        .then(data => {
          const { status, message } = data
          console.log(data)
          if (status === 'error') {
            setError(message)
            reject(new Error(message))
          } else {
            getCases()
            resolve()
          }
        })
        .catch(error => {
          if (!controller.signal.aborted) {
            console.error(error)
            reject(new Error(error))
          }
        })
    })

  useEffect(() => {
    if (isEmpty(account)) {
      return
    }
    getUsers()
    getCases()

    return () => {
      controller.abort()
    }
  }, [])

  if (isEmpty(account)) {
    history.push('/login')
    return null
  }

  if (!location.state) {
    history.push('/clients')
    return null
  }
  const client = location.state.client

  const isManager = account.metadata.role === 'MANAGER'

  return (
    <div className={classes.root}>
      <CssBaseline />
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
            {client.name + client.lastName ? client.lastName : ''}
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
          <Grid
            container
            alignItems='center'
            justify='center'
            spacing={5}
            className={classes.grid}
          >
            {cases.map((currentCase, index) => {
              const user = find(users, { id: currentCase.userID })
              console.log(user)
              return (
                <Grid key={index} item>
                  <Card className={classes.card} elevation={5}>
                    <CardContent>
                      <div style={{ display: 'flex' }}>
                        <Typography
                          className={classes.title}
                          color='textSecondary'
                          component='div'
                        >
                          {'Αρ.Φακέλου: '}
                          <span>
                            {currentCase.folderNo}
                          </span>
                        </Typography>
                      </div>
                      <Typography variant='h6'>
                        {`Ανατέθηκε σε: ${user ? user.lastName + ' ' + user.firstName : ''}`}
                      </Typography>
                      <Typography className={classes.pos} color='textSecondary'>
                        {`Φύση υπόθεσης: ${currentCase.nature}`}
                      </Typography>
                      <Typography variant='body2' component='p'>
                        {`Ημερομηνία Ανάθεσης: ${currentCase.assignmentDate ? currentCase.assignmentDate : '-'}`}
                        <br />
                        {`Ημερομηνία Περάτωσης: ${currentCase.completionDate ? currentCase.completionDate : '-'}`}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <Button
                        size='small'
                        onClick={() => {
                          history.push({
                            pathname: `/case/${currentCase.folderNo}`,
                            state: { case: currentCase }
                          })
                        }}
                      >Περισσοτερα
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
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
)(ClientCases)
