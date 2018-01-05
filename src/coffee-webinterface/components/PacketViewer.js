import React from 'react'
import Typography from 'material-ui/Typography'
import { observer } from 'mobx-react'

import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from 'material-ui/List'

import Switch from 'material-ui/Switch'
import Input from 'material-ui/Input'

import { buffers, rxtxBuffers } from '../lib/delonghi/buffers'

@observer
class HexViewer extends React.Component {
  render () {
    const {
      type,
      delonghi: {
        st: state
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

@observer
class PacketViewer extends React.Component {
  state = {
    enabled: {},
    inputs: {}
  }

  constructor (props) {
    super(props)

    const {
      type = 'lcd',
      delonghi
    } = props

    this.delonghi = delonghi
    this.type = type
  }

  handleChange = (mappedId) =>
    ({target: { value } = {}}, checked = value) => {
      const {
        props: {
          type
        },
        delonghi: {
          st: {
            setFilterInput
          }
        }
      } = this

      setFilterInput(type, mappedId, checked)
    }

  handleEnable = (mappedId) =>
    (evt, checked) => {
      const {
        props: {
          type
        },
        delonghi: {
          st: {
            setFilterEnabled
          }
        }
      } = this

      setFilterEnabled(type, mappedId, checked)
    }

  updateFilters () {
    const {
      type,
      state: {
        enabled,
        inputs
      },
      delonghi: {
        empty: {
          [type]: emptyType
        }
      }
    } = this

    const defaultValue = (val, def) => typeof val === 'undefined' ? def : val
    const convert = (val) => typeof val === 'boolean' ? Number(val) : parseInt(val, 16)

    const setObject = Object.assign(
      {},
      ...Object.keys(enabled)
        .filter((key) => !!enabled[key])
        .map(key => ({
          [key]: convert(defaultValue(inputs[key], emptyType[key]))
        }))
    )
    // console.log('applying filters: %o', setObject)
    this.delonghi.applyFilter(setObject, type, (_, changed) => changed && this.forceUpdate())
  }

  render () {
    const {
      type
    } = this

    const {
      PACKET_LEN,
      fields,
      st,
      st: {
        filters: {
          [type]: {
            enabled,
            inputs
          }
        }
      }
    } = this.delonghi

    const buffer = rxtxBuffers.find((buf) => buf.use === 'tx' && buf.type === type)
    const txBuffer = st[buffer.name]

    return (
      <React.Fragment>
        <HexViewer delonghi={this.delonghi} type={type} />
        <Input
          onBlur={({target, target: {value} = ''}) => {
            // transfer the new value to state
            st[buffer.name + '_hex'] = value
            // clear the input field
            target.value = ''
          }}
          inputProps={{maxLength: PACKET_LEN * 2}}
        />
        <List dense>
          {Object.values(fields[type]).filter((field) => !!field.mappedId).map((field, idx) => (
            <ListItem key={field.mappedId}>
              <ListItemText primary={`${field.mappedId} (${field.type})`} />
              <ListItemSecondaryAction>
                <Switch
                  checked={!!enabled.get(field.mappedId)}
                  onChange={this.handleEnable(field.mappedId)}
                />

                {(field.type === 'b1' && (
                  <React.Fragment>
                    <Switch
                      checked={!!inputs.get(field.mappedId)}
                      onChange={this.handleChange(field.mappedId)}
                      style={{height: '28px'}}
                    />
                    <Switch
                      checked={!!txBuffer.get(field.mappedId)}
                      disabled
                      style={{height: '28px'}}
                    />
                  </React.Fragment>
                )) || (
                  <React.Fragment>
                    <Input
                      value={inputs.get(field.mappedId) || ''}
                      onChange={this.handleChange(field.mappedId)}
                      // onBlur={this.handleChange(field.mappedId)}
                      style={{width: 50, marginRight: 12}}
                      inputProps={{maxLength: 2}}
                    />
                    <Input
                      value={txBuffer.get(field.mappedId) || ''}
                      style={{width: 50, marginRight: 12}}
                      inputProps={{maxLength: 2}}
                      disabled
                    />
                  </React.Fragment>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </React.Fragment>
    )
  }
}

export { PacketViewer }
