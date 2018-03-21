import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import List from 'material-ui/List'
import Typography from 'material-ui/Typography'
import Divider from 'material-ui/Divider'
import CssBaseline from 'material-ui/CssBaseline'

import withRoot from './withRoot'
import { menuItems } from './Drawer/AppDrawerMenu'

import DevTools from 'mobx-react-devtools'

const drawerWidth = 240
const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  appBar: {
    position: 'absolute',
    width: `calc(100% - ${drawerWidth}px)`
  },
  'appBar-left': {
    marginLeft: drawerWidth
  },
  'appBar-right': {
    marginRight: drawerWidth
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth
  },
  drawerHeader: theme.mixins.toolbar,
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    overflow: 'scroll',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64
    }
  }
})
class PermanentDrawer extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render () {
    const { classes, children, title } = this.props

    return (
      <div className={classes.root}>
        <CssBaseline />
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar, classes[`appBar-left`])}>
            <Toolbar>
              <Typography type='title' color='inherit' noWrap>
                {title}
              </Typography>
              <DevTools />
            </Toolbar>
          </AppBar>
          <Drawer
            variant='permanent'
            anchor='left'
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.drawerHeader} />
            <Divider />
            <List>{menuItems}</List>
            <Divider />
          </Drawer>
          <main className={classes.content}>
            {children}
          </main>
        </div>
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(PermanentDrawer))
