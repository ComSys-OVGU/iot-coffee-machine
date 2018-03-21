import React, { Fragment } from 'react'
import AppFrame from '../components/AppFrame'
import { Button, Grid, Typography, Paper, Card } from 'material-ui'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'

import { API } from '../lib/api'
import { state } from '../components/state'
import { observer } from 'mobx-react'

const paper = {
  height: '100%',
  padding: '10px'
}

const gridCol = {
  container: true,
  justify: 'center',
  alignItems: 'center',
  direction: 'column'
}

const gridRow = {
  container: true,
  justify: 'center',
  alignItems: 'stretch',
  direction: 'row'
}


const styles = {
  sumCard: {
    margin: 'auto',
    maxWidth: 300,
    fontSize: '3em',
    fontWeight: 'bold',
    padding: 30
  },
  sum: {
    textAlign: 'center'
  }
}

@observer
class OrderPage extends React.Component {
  componentDidMount() {
    state.getHistory()
  }
  render () {
    const {
      billItems: history,
      billSum
    } = state
    return (
      <AppFrame title='History of your orders'>
        {history?(
          <Fragment>
            <Card style={styles.sumCard}>
              <Typography variant='headline' style={styles.sum}>
                Sum:&nbsp;
                <strong>
                  {billSum.toLocaleString('de-DE', {currency: 'EUR', style: 'currency' })}
                </strong>
              </Typography>
            </Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell numeric>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Taste</TableCell>
                  <TableCell numeric>Coffee Weight</TableCell>
                  <TableCell numeric>Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map(n => {
                  return (
                    <TableRow key={n.id}>
                      <TableCell numeric>{new Date(n.date).toDateString()}</TableCell>
                      <TableCell>{n.product.displayName}</TableCell>
                      <TableCell>{n.taste.displayName}</TableCell>
                      <TableCell numeric>{n.taste.weight}</TableCell>
                      <TableCell numeric>{Number(n.cost).toLocaleString('de-DE', {currency: 'EUR', style: 'currency' })}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell numeric><strong>Sum</strong></TableCell>
                  <TableCell numeric>{Number(billSum).toLocaleString('de-DE', {currency: 'EUR', style: 'currency' })}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Fragment>
        ):(
          <div>Loading</div>          
        )}
      </AppFrame>
    )
  }
}

export default OrderPage
