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
import { Button } from '@material-ui/core'
import { fetch } from 'whatwg-fetch'
import { baseURL } from '../general/constants'
import { objectToQueryString } from '../general/helperFunctions'
import useStyles from '../styles'
import MaterialTable from 'material-table'
import caseTableIcons from './CaseTableIcons'
import find from 'lodash.find'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'

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

const columns = [
  { title: 'Αριθμός φακέλου', field: 'folderNo' },
  { title: 'Φύση υπόθεσης', field: 'nature' },
  { title: 'Ανατέθηκε σε', field: 'userID', lookup: {} },
  { title: 'Ημερομηνία ανάθεσης', field: 'assignmentDate', type: 'date' },
  { title: 'Ημερομηνία περάτωσης', field: 'completionDate', type: 'date' },
  {
    title: 'Πελάτης',
    field: 'clientID',
    lookup: {}
  }
]

const casesURL = baseURL + 'cases'
const usersURL = baseURL + 'users/'
const clientsURL = baseURL + 'clients/'

function Home ({ deleteAccount, account }) {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const [error, setError] = useState('')
  const [reason, setReason] = useState('')
  const [cases, setCases] = useState([])
  const history = useHistory()
  const controller = new window.AbortController()
  const signal = controller.signal

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const getCases = () => {
    setReason('Γίνεται λήψη υποθέσεων')
    fetch(casesURL + objectToQueryString({ userID: account.metadata.id }), {
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

  const getClients = () =>
    new Promise((resolve, reject) => {
      setReason('Γίνεται λήψη πελατών')
      fetch(clientsURL, {
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
            const columnToEdit = find(columns, { field: 'clientID' })
            result.forEach(client => {
              columnToEdit.lookup[parseInt(client.id)] = client.lastName !== undefined ? client.lastName + ' ' + client.name : client.name
            })
            setReason('')
            resolve()
          }
        })
        .catch(error => {
          setReason('')
          if (!controller.signal.aborted) {
            console.error(error)
          }
          resolve()
        })
    })

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
            const columnToEdit = find(columns, { field: 'userID' })
            result.forEach(user => {
              columnToEdit.lookup[parseInt(user.id)] = user.lastName + ' ' + user.firstName
            })
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

  useEffect(() => {
    if (isEmpty(account)) {
      return
    }
    getUsers().then(() => getClients().then(() => getCases()))

    return () => {
      controller.abort()
    }
  }, [])

  if (isEmpty(account)) {
    history.push('/login')
    return null
  }
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
            {account.metadata.lastName + ' ' + account.metadata.firstName}
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
          <MaterialTable
            icons={caseTableIcons}
            options={{
              grouping: true
            }}
            onRowClick={(event, rowData) => {
              history.push({
                pathname: `case/${rowData.folderNo}`,
                state: { case: rowData }
              })
            }}
            title='Οι υποθέσεις μου'
            columns={columns}
            data={cases}
            localization={{
              body: {
                addTooltip: 'Νέα υπόθεση',
                deleteTooltip: 'Διαγραφή υπόθεσης',
                editTooltip: 'Επεξεργασία υπόθεσης',
                editRow: {
                  deleteText:
                  'Διαγραφή υπόθεσης;',
                  cancelTooltip: 'Ακύρωση',
                  saveTooltip: 'Επιβεβαίωση'
                }
              },
              header: {
                actions: 'Ενέργειες'
              },
              grouping: {
                placeholder: 'Σύρετε στήλη για ομαδοποίηση'
              },
              pagination: {
                firstTooltip: 'Πρώτη σελίδα',
                lastTooltip: 'Τελευταία σελίδα',
                nextTooltip: 'Επόμενη σελίδα',
                previousTooltip: 'Προηγούμενη σελίδα',
                labelRowsSelect: 'γραμμές',
                labelDisplayedRows: '{from}-{to} από {count}'
              },
              toolbar: {
                searchTooltip: 'Αναζήτηση',
                searchPlaceholder: 'Αναζήτηση'
              }
            }}
          />
        </Container>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
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
)(Home)
