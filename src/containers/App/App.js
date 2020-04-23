import A2HSProvider from 'a2hs'
import Loadable from 'react-loadable'
import PropTypes from 'prop-types'
import LoadingComponent from '../../components/LoadingComponent'
import React from 'react'
import config from '../../config'
import configureStore from '../../store'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import Analytics from '../../containers/Analytics/Analytics'

const Loading = () => <LoadingComponent />

export const RootAsync = Loadable({
  loader: () => import('../Root'),
  loading: Loading,
})

const App = ({ appConfig }) => {
  const store =
    appConfig && appConfig.configureStore
      ? appConfig.configureStore()
      : configureStore()
  const configs = { ...config, ...appConfig }
  const { landingPage: LandingPage = false } = configs

  return (
    <A2HSProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            {LandingPage && (
              <Route path="/" exact>
                <React.Fragment>
                  <LandingPage />
                  {configs.analyticsProps && (
                    <Analytics {...configs.analyticsProps} />
                  )}
                </React.Fragment>
              </Route>
            )}
            <Switch>
              <Route>
                <RootAsync appConfig={configs} />
              </Route>
            </Switch>
          </Switch>
        </BrowserRouter>
      </Provider>
    </A2HSProvider>
  )
}

App.propTypes = {
  appConfig: PropTypes.object.isRequired,
}

export default App
