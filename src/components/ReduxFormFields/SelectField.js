import PropTypes from 'prop-types'
import { VirtualizedSelectField } from 'muishift'
import { Component, createElement } from 'react'
import { mapError } from '../../utils/mapError'

/**
 * Creates a component class that renders the given Material UI component
 *
 * @param MaterialUIComponent The material ui component to render
 * @param mapProps A mapping of props provided by redux-form to the props the Material UI
 * component needs
 */
function createComponent(MaterialUIComponent, mapProps) {
  class InputComponent extends Component {
    getRenderedComponent() {
      // eslint-disable-next-line react/no-string-refs
      return this.refs.component
    }

    render() {
      const { input, ...rest } = this.props
      const { value, ...inputRest } = input

      let newProps = this.props

      if (typeof value === 'string' || value instanceof String) {
        newProps = {
          input: {
            value: undefined,
            ...inputRest,
          },
          ...rest,
        }
      }

      return createElement(MaterialUIComponent, {
        ...mapProps(newProps),
        ref: 'component',
      })
    }
  }

  InputComponent.propTypes = {
    input: PropTypes.any,
  }
  InputComponent.displayName = `ReduxFormMaterialUI${MaterialUIComponent.name}`
  return InputComponent
}

createComponent.propTypes = {
  input: PropTypes.any,
  name: PropTypes.any,
}

export default createComponent(
  VirtualizedSelectField,
  ({
    input: { onChange, value, onBlur, ...inputProps },
    onChange: onChangeFromField,
    ...props
  }) => ({
    ...mapError(props),
    ...inputProps,
    value: value,
    onChange: selectedValues => {
      onChange(selectedValues)
      if (onChangeFromField) {
        onChangeFromField(selectedValues)
      }
    },
    onBlur: () => onBlur(value),
  })
)
