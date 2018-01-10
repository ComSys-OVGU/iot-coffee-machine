import React from 'react'

const styles = {
  pre: {
    height: '100%',
    overflow: 'scroll'
  }
}

class LogViewerPure extends React.PureComponent {
  componentDidUpdate () {
    this.preEl && (this.preEl.scrollTop = this.preEl.scrollHeight)
  }

  render () {
    const {
      history
    } = this.props

    return (
      <pre ref={(ref) => { this.preEl = ref }} style={styles.pre}>
        {history.map((data, idx) => (
          <React.Fragment key={idx}>{data}<br /></React.Fragment>
        ))}
      </pre>
    )
  }
}

class LogViewer extends React.Component {
  state = {
    history: []
  }

  componentDidMount () {
    this.props.delonghi.onData(this.handleDelonghiData)
  }

  handleDelonghiData = (data) => {
    this.setState((prevState) => ({
      ...prevState,
      history: [...prevState.history.slice(-100), data]
    }))
  }

  componentWillUnmount () {
    this.props.delonghi.offData(this.handleDelonghiData)
  }

  render () {
    const {
      history
    } = this.state

    return (
      <LogViewerPure history={history} />
    )
  }
}

export { LogViewer, LogViewerPure }
