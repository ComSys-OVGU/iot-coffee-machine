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
import Reboot from 'material-ui/Reboot'

import withRoot from './withRoot'
import { menuItems } from './Drawer/AppDrawerMenu'

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
    const drawer = (
      <Drawer
        type='permanent'
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader} />
        <Divider />
        <List>{menuItems}</List>
        <Divider />
      </Drawer>
    )
    return (
      <div className={classes.root}>
        <Reboot />
        <div className={classes.appFrame}>
          <AppBar className={classNames(classes.appBar, classes[`appBar-left`])}>
            <Toolbar>
              <Typography type='title' color='inherit' noWrap>
                {title}
              </Typography>
            </Toolbar>
          </AppBar>
          {drawer}
          <main className={classes.content}>
            {children}
          </main>
        </div>
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(PermanentDrawer))
