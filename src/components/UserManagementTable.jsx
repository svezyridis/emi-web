import React, { useState, useEffect } from 'react'

import isEmpty from 'lodash.isempty'
import { useHistory } from 'react-router-dom'
import MaterialTable from 'material-table'
import tableIcons from './ClientIcons'
import { fetch } from 'whatwg-fetch'
import { baseURL } from '../general/constants'
import find from 'lodash.find'
import TextField from '@material-ui/core/TextField'

const columns = [
  { title: 'Όνομα', field: 'firstName' },
  { title: 'Επίθετο', field: 'lastName' },
  { title: 'username', field: 'username' },
  {
    title: 'password',
    field: 'password',
    editComponent: props => (
      <TextField
        type='password'
        placeholder={props.columnDef.title}
        value={props.value === undefined ? '' : props.value}
        onChange={event => props.onChange(event.target.value)}
        InputProps={{
          style: {
            fontSize: 13
          }
        }}
      />
    ),
    render: rowData => <TextField
      type='password'
      disabled
      value={rowData}
    />
  },
  { title: 'Ρόλος', field: 'roleID', lookup: {} }
]

const usersURL = baseURL + 'users/'
const rolesURL = baseURL + 'roles/'

const UserManagementTable = ({
  open,
  toogleDrawer,
  account,
  deleteAccount,
  dark
}) => {
  const [users, setUsers] = useState([])
  const controller = new window.AbortController()
  const signal = controller.signal

  const getRoles = () => new Promise((resolve, reject) => {
    fetch(rolesURL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      signal: signal
    })
      .then(response => {
        if (response.ok) { return response.json() } else throw Error(`Request rejected with status ${response.status}`)
      })
      .then(data => {
        console.log(data)
        if (data.status === 'success') {
          const roles = data.result
          const columnToEdit = find(columns, { field: 'roleID' })
          roles.forEach(role => {
            columnToEdit.lookup[parseInt(role.id)] = role.role
          })
          resolve()
        } else (reject(data.message))
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          console.error(error)
        }
        reject(error)
      })
  })
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
        if (response.ok) { return response.json() } else throw Error(`Request rejected with status ${response.status}`)
      })
      .then(data => {
        console.log(data)
        if (data.status === 'success') {
          setUsers(
            data.result.map(user => ({
              ...user,
              roleID: parseInt(user.roleID)
            }))
          )
        }
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          console.error(error)
        }
      })
  }

  useEffect(() => {
    getRoles().then(() => getUsers())
    return () => {
      controller.abort()
    }
  }, [])

  const deleteUser = user =>
    new Promise((resolve, reject) => {
      fetch(usersURL + user.id, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        signal: signal
      })
        .then(response => {
          if (response.ok) { return response.json() } else throw Error(`Request rejected with status ${response.status}`)
        })
        .then(data => {
          console.log(data)
          if (data.status === 'success') {
            const oldDataIndex = users.indexOf(user)
            setUsers(users =>
              users.filter((row, index) => index !== oldDataIndex)
            )
            resolve()
          } else reject(data.message)
        })
        .catch(err => reject(err))
    })

  const updateUser = (updatedUser) =>
    new Promise((resolve, reject) => {
      console.log(updatedUser)
      const requestData = JSON.stringify({
        username: updatedUser.username,
        password: updatedUser.password,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        roleID: updatedUser.roleID,
        id: updatedUser.id
      })
      fetch(usersURL, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: requestData,
        signal: signal
      })
        .then(response => {
          if (response.ok) { return response.json() } else throw Error(`Request rejected with status ${response.status}`)
        })
        .then(data => {
          console.log(data)
          if (data.status === 'success') {
            getUsers()
            resolve()
          } else reject(data.message)
        })
        .catch(err => reject(err))
    })

  const addNewUser = newUser => {
    return new Promise((resolve, reject) => {
      fetch(usersURL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(newUser),
        signal: signal
      })
        .then(response => {
          if (response.ok) { return response.json() } else throw Error(`Request rejected with status ${response.status}`)
        })
        .then(data => {
          console.log(data)
          if (data.status === 'success') {
            getUsers()
            resolve()
          } else reject(data.message)
        })
        .catch(err => reject(err))
    })
  }

  return (
    <MaterialTable
      icons={tableIcons}
      options={{
        grouping: true
      }}
      title='Χρήστες'
      columns={columns}
      data={users}
      editable={{
        onRowAdd: newData => addNewUser(newData),
        onRowDelete: oldData => deleteUser(oldData)
      }}
      localization={{
        body: {
          addTooltip: 'Προσθήκη Χρήστη',
          deleteTooltip: 'Διαγραφή Χρήστη',
          editTooltip: 'Επεξεργασία',
          editRow: {
            deleteText:
                  'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτόν τον χρήστη;',
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
  )
}
export default UserManagementTable
