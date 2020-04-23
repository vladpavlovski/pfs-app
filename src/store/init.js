import { isAuthorised } from '../utils/auth'
import config from '../config'

export const initState = {
  auth: { isAuthorised: isAuthorised() },
  ...config.initial_state,
}

export default initState
