import React from 'react'
import Typography from 'material-ui/Typography'
import { observer } from 'mobx-react'

import { buffers } from '../lib/delonghi/buffers'

@observer
export class HexViewer extends React.Component {
  render () {
    const {
      type,
      delonghi: {
        state
      }
    } = this.props

    const displayBuffers = buffers.filter(({type: bufferType}) => type === bufferType)

    return (
      <React.Fragment>
        <Typography>Filters</Typography>
        <pre>
          {displayBuffers.map((buffer) => (
            <React.Fragment key={buffer.name}>
              {`${buffer.type}:${buffer.display || buffer.use}`.toUpperCase().padEnd(9, ' ')}{state[buffer.name + '_hex']}<br />
            </React.Fragment>
          ))}
        </pre>
      </React.Fragment>
    )
  }
}
