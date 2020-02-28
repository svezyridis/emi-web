import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
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
import { Button, TextField } from '@material-ui/core'
import { fetch } from 'whatwg-fetch'
import { baseURL } from '../general/constants'
import find from 'lodash.find'
import MaterialTable from 'material-table'
import caseTableIcons from './CaseTableIcons'
import useStyles from '../styles'

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

const clientsURL = baseURL + 'clients'

function Clients ({ deleteAccount, account }) {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const [error, setError] = useState('')
  const [reason, setReason] = useState('')
  const [clients, setClients] = useState([])
  const [nameError, setNameError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [mailError, setMailError] = useState(false)
  const history = useHistory()
  const controller = new window.AbortController()
  const signal = controller.signal

  const columns = [
    {
      title: 'Όνομα',
      field: 'name',
      editComponent: props => {
        return (
          <TextField
            type='text'
            placeholder={props.columnDef.title}
            autoFocus
            margin='dense'
            value={props.value === undefined ? '' : props.value}
            onChange={event => {
              props.onChange(event.target.value)
            }}
            InputProps={{
              style: {
                fontSize: 13
              }
            }}
            error={nameError}
            helperText={nameError ? 'Παρακαλώ εισάγετε όνομα' : null}
          />)
      }
    },
    { title: 'Επώνυμο', field: 'lastName' },
    {
      title: 'Τηλέφωνo',
      field: 'phoneNumber',
      editComponent: props => {
        return (
          <TextField
            type='text'
            placeholder={props.columnDef.title}
            margin='dense'
            value={props.value === undefined ? '' : props.value}
            onChange={event => {
              if (!isNaN(event.target.value) && event.target.value.length <= 10) { props.onChange(event.target.value) }
            }}
            InputProps={{
              style: {
                fontSize: 13
              }
            }}
            error={phoneError}
            helperText={phoneError ? 'Λιγότερα από 10 ψηφία' : null}
          />)
      }
    },
    {
      title: 'E-mail',
      field: 'email',
      editComponent: props => {
        return (
          <TextField
            type='text'
            placeholder={props.columnDef.title}
            margin='dense'
            value={props.value === undefined ? '' : props.value}
            onChange={event => {
              props.onChange(event.target.value)
            }}
            InputProps={{
              style: {
                fontSize: 13
              }
            }}
            error={mailError}
            helperText={mailError ? 'Μη έγκυρο email' : null}
          />)
      }
    },
    {
      title: 'Υποθέσεις',
      field: 'noOfCases',
      editable: 'never',
      grouping: false,
      render: rowData => {
        return rowData ? (
          <Badge color='secondary' badgeContent={rowData.noOfCases} showZero>
            <Button
              variant='contained'
              onClick={() =>
                history.push({
                  pathname: `cases/${rowData.id}`,
                  state: { classroom: rowData }
                })}
            >
              ΠΡΟΒΟΛΗ
            </Button>
          </Badge>
        ) : null
      }

    }
  ]

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const getClients = () => {
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
          setClients(result)
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
  const clearErrors = () => {
    setNameError(false)
    setPhoneError(false)
    setMailError(false)
  }

  function validateEmail (mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    return (false)
  }

  const addClient = newClient =>
    new Promise((resolve, reject) => {
      clearErrors()
      let nameError = false
      let phoneError = false
      let mailError = false
      if (!newClient.name) {
        nameError = true
        reject(new Error('name error'))
      }
      if (newClient.name.trim().length === 0) {
        nameError = true
        reject(new Error('name error'))
      }
      if (newClient.phoneNumber && newClient.phoneNumber.length !== 10) {
        phoneError = true
        reject(new Error('phone error'))
      }
      if (newClient.email && !validateEmail(newClient.email)) {
        mailError = true
        reject(new Error('mail error'))
      }
      if (nameError || phoneError || mailError) {
        setNameError(nameError)
        setPhoneError(phoneError)
        setMailError(mailError)
        return
      }

      fetch(clientsURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(newClient),
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
            reject(new Error(message))
          } else {
            getClients()
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
    getClients()
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
            Πελάτες
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
          <MaterialTable
            icons={caseTableIcons}
            editable={{
              onRowAdd: newData => addClient(newData),
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
            title='Πελάτες'
            columns={columns}
            data={clients}
            localization={{
              body: {
                addTooltip: 'Νέος πελάτης',
                deleteTooltip: 'Διαγραφή πελάτη',
                editTooltip: 'Επεξεργασία πελάτη',
                editRow: {
                  deleteText:
                  'Διαγραφή πελάτη;',
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
)(Clients)
