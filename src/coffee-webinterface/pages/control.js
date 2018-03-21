import React from 'react'
import AppFrame from '../components/AppFrame'
import { Button, Grid, Typography, Paper } from 'material-ui'

import { init, delonghi } from '../lib/delonghi'
import { observer } from 'mobx-react'
import { HexViewer } from '../components/HexViewer'

// initialize delonghi with default transport and protocol
init()

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

const prefixed = (btn) => `buttons_${btn}`

@observer
class DelonghiButton extends React.Component {
  render () {
    const {
      type = ''
    } = this.props

    const title = type.toUpperCase()
    const active = delonghi.state.filters.lcd.obj[prefixed(type)] === 1 || delonghi.state.DL_RxBuffer_LCD.get(prefixed(type)) === 1
    const pressButton = () => {
      delonghi.state.pressButton(prefixed(type))
    }

    return (
      <Grid item xs>
        <Button raised="true" color={active ? 'accent' : 'primary'} onClick={pressButton}>
          {title}
        </Button>
      </Grid>
    )
  }
}

class ControlPage extends React.Component {
  render () {
    return (
      <AppFrame title='Control'>
        <Grid {...gridRow}>
          <Grid item xs>
            <Grid {...gridCol}>
              <DelonghiButton type='pwr' />
            </Grid>
          </Grid>
          <Grid item xs>

              <Grid {...gridCol}>
                <Grid item xs>
                  <Grid {...gridRow}>
                    <Grid item xs>
                      <HexViewer type='lcd' delonghi={delonghi} />
                    </Grid>
                    <Grid item xs>
                      <HexViewer type='pb' delonghi={delonghi} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Grid {...gridRow}>
                    <DelonghiButton type='p' />
                    <DelonghiButton type='flush_water' />
                    <DelonghiButton type='hot_water' />
                    <DelonghiButton type='ok' />
                  </Grid>
                </Grid>
                <Grid item xs>
                  <Grid {...gridRow} spacing={8}>
                    <DelonghiButton type='cappuchino' />
                    <DelonghiButton type='latte_macchiato' />
                    <DelonghiButton type='caffee_latte' />
                  </Grid>
                </Grid>
              </Grid>

          </Grid>
          <Grid item xs>
            <Grid {...gridCol}>
              <DelonghiButton type='one_small_coffee' />
              <DelonghiButton type='two_small_coffees' />
              <DelonghiButton type='one_big_coffee' />
              <DelonghiButton type='two_big_coffees' />
            </Grid>
          </Grid>
        </Grid>
      </AppFrame>
    )
  }
}

export default ControlPage
