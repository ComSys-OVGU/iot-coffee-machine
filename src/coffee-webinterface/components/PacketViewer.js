import React from 'react'
import Typography from 'material-ui/Typography'

import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from 'material-ui/List'

import Switch from 'material-ui/Switch'
import Input from 'material-ui/Input'

class FilterViewer extends React.PureComponent {
  render () {
    const {
      and,
      or
    } = this.props

    return (
      <React.Fragment>
        <Typography>Filters</Typography>
        <pre>
          & {and}<br />
          | {or}
        </pre>
      </React.Fragment>
    )
  }
}

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
    ({target: { value } = {}}, checked = value) => this.setState(({inputs, ...rest}) => ({
      ...rest,
      inputs: {
        ...inputs,
        [mappedId]: checked
      }
    }), () => this.updateFilters())

  handleEnable = (mappedId) =>
    (evt, checked) => this.setState(({enabled, ...rest}) => ({
      ...rest,
      enabled: {
        ...enabled,
        [mappedId]: checked
      }
    }), () => this.updateFilters())

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
      inputs,
      enabled
    } = this.state

    const {
      PACKET_LEN,
      fields,
      state: {
        filters: {
          [type]: {
            andHex,
            orHex
          }
        }
      }
    } = this.delonghi

    return (
      <React.Fragment>
        <FilterViewer and={andHex} or={orHex} />
        <Input
          onBlur={async ({target: {value} = {}}) => {
            // const pkg = await decode(value, type)
            // this.setState((oldState) => ({
            //   ...oldState,
            //   [type]: {
            //     ...oldState[type],
            //     ...pkg
            //   }
            // }))
          }}
          inputProps={{maxLength: PACKET_LEN * 2}}
        />
        <List dense>
          {Object.values(fields[type]).filter((field) => !!field.mappedId).map((field, idx) => (
            <ListItem key={field.mappedId}>
              <ListItemText primary={`${field.mappedId} (${field.type})`} />
              <ListItemSecondaryAction>
                <Switch
                  checked={!!enabled[field.mappedId]}
                  onChange={this.handleEnable(field.mappedId)}
                />

                {(field.type === 'b1' && (
                  <Switch
                    checked={!!inputs[field.mappedId]}
                    onChange={this.handleChange(field.mappedId)}
                    style={{height: '28px'}}
                  />
                )) || (
                  <Input
                    value={inputs[field.mappedId] || ''}
                    onChange={this.handleChange(field.mappedId)}
                    // onBlur={this.handleChange(field.mappedId)}
                    style={{width: 50, marginRight: 12}}
                    inputProps={{maxLength: 2}}
                  />
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
