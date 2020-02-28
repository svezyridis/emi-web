import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import PeopleIcon from '@material-ui/icons/People'
import { connect } from 'react-redux'
import { newAccount, deleteAccount } from '../store/actions'
import isEmpty from 'lodash.isempty'
import { useHistory } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { fetch } from 'whatwg-fetch'
import { baseURL } from '../general/constants'
import find from 'lodash.find'
import MaterialTable from 'material-table'
import caseTableIcons from './CaseTableIcons'

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

const drawerWidth = 300

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  },
  logout: {
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '10px'
  }
}))

const casesURL = baseURL + 'cases'
const usersURL = baseURL + 'users'

const columns = [
  { title: 'Αριθμός φακέλου', field: 'folderNo' },
  { title: 'Φύση υπόθεσης', field: 'nature' },
  { title: 'Ανατέθηκε σε', field: 'userID', lookup: {} },
  { title: 'Ημερομηνία ανάθεσης', field: 'assignmentDate', type: 'date' },
  { title: 'Ημερομηνία ολοκλήρωσης', field: 'completionDate', type: 'date' },
  { title: 'Πελάτης', field: 'clientID', lookup: {} }
]

function Cases ({ deleteAccount, account }) {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const [error, setError] = useState('')
  const [reason, setReason] = useState('')
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
    fetch(casesURL, {
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

  const getUsers = () => {
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
        const { status, result, message } = data
        console.log(data)
        if (status === 'error') {
          setError(message)
        } else {
          const columnToEdit = find(columns, { field: 'userID' })
          result.forEach(user => {
            columnToEdit.lookup[parseInt(user.id)] = user.lastName + ' ' + user.firstName
          })
        }
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          console.error(error)
        }
      })
  }

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
        body: JSON.stringify({ ...newCase, clientID: 2 }),
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
            setError(message)
            reject(new Error(message))
          } else {
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
    return () => {
      controller.abort()
    }
  }, [])

  if (isEmpty(account)) {
    history.push('/login')
    return null
  }

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
            Υποθέσεις
          </Typography>
          <IconButton color='inherit'>
            <Badge badgeContent={4} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
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
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary='Αρχείο' />
            </ListItem>
            <ListItem button onClick={() => history.push('/clients')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary='Πελάτες' />
            </ListItem>
          </div>
        </List>
        <Divider />
        {open ? <Button variant='contained' size='medium' color='secondary' className={classes.logout} onClick={() => deleteAccount()}>ΕΞΟΔΟΣ</Button> : null}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth='lg' className={classes.container}>
          <Grid container spacing={3}>
            <MaterialTable
              icons={caseTableIcons}
              options={{
                grouping: true
              }}
              editable={{
                onRowAdd: newData => addCase(newData),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data
                        const index = data.indexOf(oldData)
                        data[index] = newData
                        this.setState({ data }, () => resolve())
                      }
                      resolve()
                    }, 1000)
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data
                        const index = data.indexOf(oldData)
                        data.splice(index, 1)
                        this.setState({ data }, () => resolve())
                      }
                      resolve()
                    }, 1000)
                  })
              }}
              title='Υποθέσεις'
              columns={columns}
              data={[]}
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
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
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
)(Cases)
