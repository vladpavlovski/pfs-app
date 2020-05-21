import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TrackVisibility from 'react-on-screen'

class AsyncComponent extends Component {
  state = {
    component: null,
  }

  componentDidMount() {
    const { load } = this.props
    load().then(cmp => {
      this.setState({ component: cmp.default })
    })
  }

  render() {
    const C = this.state.component
    return C ? <C {...this.props} /> : null
  }
}

AsyncComponent.propTypes = {
  load: PropTypes.func,
}

const CustomLoad = ({ load }) => {
  return (
    <TrackVisibility once partialVisibility>
      {({ isVisible }) => (isVisible ? <AsyncComponent load={load} /> : null)}
    </TrackVisibility>
  )
}

CustomLoad.propTypes = {
  load: PropTypes.any,
}

export default CustomLoad
