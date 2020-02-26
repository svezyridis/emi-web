import React, { useState, useEffect } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useSelector } from 'react-redux'
import './App.css'
import Login from './components/SignIn'

const themeObject = {
  palette: {
    primary: {
      main: '#2f353b'
    },
    secondary: {
      main: '#36332e'
    },
    info: {
      main: '#a8976e'
    }
  },
  typography: {
    useNextVariants: true
  }
}

const useDarkMode = () => {
  const [theme, setTheme] = useState(themeObject)
  const toogleDarkMode = dark => {
    const updatedTheme = {
      ...theme,
      palette: {
        ...theme.palette,
        type: dark ? 'dark' : 'light'
      }
    }
    setTheme(updatedTheme)
  }
  return [theme, toogleDarkMode]
}

function App () {
  const [theme, toogleDarkMode] = useDarkMode()
  const dark = useSelector(state => state.dark)
  useEffect(() => {
    toogleDarkMode(dark)
  }, [dark])
  const themeConfig = createMuiTheme(theme)
  return (
    <Router>
      <MuiThemeProvider theme={themeConfig}>
        <CssBaseline />
        <Switch>
          <Route exact path='/' component={Login} />
        </Switch>
      </MuiThemeProvider>
    </Router>
  )
}

export default App