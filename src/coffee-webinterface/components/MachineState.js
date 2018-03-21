import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { state } from '../components/state'
import { observer } from 'mobx-react'

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
});

@withStyles(styles)
@observer
export class MachineState extends React.Component {
  render() {
    const { classes } = this.props;

    const { 
      ready: {
        ready = false
      } = {}
    } = state.currentState

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title}>Machine State</Typography>
            <Typography variant="headline" component="h2">
              {ready?'The machine is ready':'The machine is not ready'}
            </Typography>
            {/*<Typography className={classes.pos}>adjective</Typography>
            <Typography component="p">
              well meaning and kindly.<br />
              {'"a benevolent smile"'}
            </Typography>*/}
          </CardContent>
          {/* <CardActions>
            <Button size="small">Order favorite coffee</Button>
          </CardActions> */}
        </Card>
      </div>
    )
  }
}
