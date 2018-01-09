import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import withRoot from '../components/withRoot'

import Link from 'next/link'

const styles = {
  root: {
    textAlign: 'center',
    paddingTop: 200
  }
}

class Index extends React.Component {
  state = {
    open: false
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  handleClick = () => {
    this.setState({
      open: true
    })
  }

  render () {
    return (
      <div className={this.props.classes.root}>
        <Typography type='display1' gutterBottom>
          Coffee Webinterface
        </Typography>
        <Link href='/control'>
          <a>Enter here</a>
        </Link>
      </div>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withRoot(withStyles(styles)(Index))
