import React from 'react'
import AppFrame from '../components/AppFrame'
import { Button, Grid, Typography, Paper } from 'material-ui'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import { MachineState } from '../components/MachineState'

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

@observer
class OrderPage extends React.Component {

  orderBeverage(type, taste) {
    API.orderBeverage(type, taste)
  }
  // async test() {
  //   console.log(await API.getProducts())
  // }
  // componentDidMount () {
  //   this.test()
  // }
  render () {
    return (
      <AppFrame title='Order a coffee'>
        <MachineState />
        <br/>
        <Typography>Order a beverage of your choice</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Taste</TableCell>
              <TableCell numeric>Coffee Weight</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...state.products.map(product => 
              product.tastes.map(taste => (
                <TableRow key={`${product.name}_${taste.name}`}>
                  <TableCell>{product.displayName}</TableCell>
                  <TableCell>{taste.displayName}</TableCell>
                  <TableCell numeric>{taste.weight}g</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="primary"
                      disabled={!state.currentState.ready.ready}
                      onClick={() => this.orderBeverage(product.name, taste.name)}
                    >
                      Order
                    </Button>
                    {/* <Button size="small">Set Favorite</Button> */}
                  </TableCell>
                </TableRow>
                )
              )
            )]}
          </TableBody>
        </Table>
      </AppFrame>
    )
  }
}

export default OrderPage
