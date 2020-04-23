import AvatarImageField from '../ReduxFormFields/AvatarImageField'
import Business from '@material-ui/icons/Business'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import TextField from '../ReduxFormFields/TextField'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { ImageCropDialog } from '../../containers/ImageCropDialog'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { setDialogIsOpen } from '../../store/dialogs/actions'
import { withRouter } from 'react-router-dom'
import { withTheme } from '@material-ui/core/styles'

const FormComponent = props => {
  const {
    handleSubmit,
    intl,
    initialized,
    setDialogIsOpen,
    dialogs,
    match,
    change,
  } = props

  const uid = useMemo(() => match.params.uid, [match])

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        height: '100%',
        width: '100%',
        alignItems: 'strech',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <button type="submit" style={{ display: 'none' }} />

      <div style={{ margin: 15, display: 'flex', flexDirection: 'column' }}>
        <AvatarImageField
          name="photoURL"
          disabled={!initialized}
          uid={uid}
          change={change}
          initialized={initialized}
          icon={<Business fontSize="large" />}
          intl={intl}
          path={'companies'}
        />

        <div>
          <Field
            name="name"
            disabled={!initialized}
            component={TextField}
            placeholder={intl.formatMessage({ id: 'name_hint' })}
            label={intl.formatMessage({ id: 'name_label' })}
          />
        </div>

        <div>
          <Field
            name="full_name"
            disabled={!initialized}
            component={TextField}
            placeholder={intl.formatMessage({ id: 'full_name_hint' })}
            label={intl.formatMessage({ id: 'full_name_label' })}
          />
        </div>

        <div>
          <Field
            name="vat"
            disabled={!initialized}
            component={TextField}
            placeholder={intl.formatMessage({ id: 'vat_hint' })}
            label={intl.formatMessage({ id: 'vat_label' })}
          />
        </div>

        <div>
          <Field
            name="description"
            disabled={!initialized}
            component={TextField}
            multiline
            rows={2}
            placeholder={intl.formatMessage({ id: 'description_hint' })}
            label={intl.formatMessage({ id: 'description_label' })}
          />
        </div>

        <ImageCropDialog
          path={`companies/${uid}`}
          fileName={'photoURL'}
          onUploadSuccess={() => {
            // TODO: find this function parameter s
            // handlePhotoUploadSuccess(s)
          }}
          open={dialogs.new_company_photo !== undefined}
          src={dialogs.new_company_photo}
          handleClose={() => {
            setDialogIsOpen('new_company_photo', undefined)
          }}
          title={intl.formatMessage({ id: 'change_photo' })}
        />
      </div>
    </form>
  )
}

FormComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialized: PropTypes.bool.isRequired,
  setDialogIsOpen: PropTypes.func.isRequired,
  dialogs: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  change: PropTypes.func,
}

const Form = reduxForm({ form: 'company' })(FormComponent)
const selector = formValueSelector('company')

const mapStateToProps = state => {
  const { intl, vehicleTypes, users, dialogs } = state

  return {
    intl,
    vehicleTypes,
    users,
    dialogs,
    photoURL: selector(state, 'photoURL'),
  }
}

export default connect(mapStateToProps, { setDialogIsOpen })(
  injectIntl(withRouter(withTheme(Form)))
)
