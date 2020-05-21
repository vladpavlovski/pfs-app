import EditActivity from '../../containers/Activities/EditActivity'
import Form from '../../components/Forms/Company'
import React, { useCallback } from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'

const name = 'company'
const path = 'companies'

const Edit = props => {
  const { intl } = props
  const validate = useCallback(
    values => {
      const errors = {}

      errors.name = !values.name
        ? intl.formatMessage({ id: 'error_required_field' })
        : ''
      errors.full_name = !values.full_name
        ? intl.formatMessage({ id: 'error_required_field' })
        : ''
      errors.vat = !values.vat
        ? intl.formatMessage({ id: 'error_required_field' })
        : ''

      return errors
    },
    [intl]
  )

  return (
    <EditActivity
      name={name}
      path={path}
      fireFormProps={{
        validate,
      }}
    >
      <Form {...props} />
    </EditActivity>
  )
}
Edit.propTypes = {
  intl: PropTypes.object.isRequired,
}

export default injectIntl(Edit)
