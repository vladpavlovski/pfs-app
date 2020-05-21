import PropTypes from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import LockIcon from '@material-ui/icons/Lock'
import React, { useEffect } from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import FacebookIcon from '@material-ui/icons/Facebook'
import { Helmet } from 'react-helmet'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import messages_en from './en.json'
import messages_de from './de.json'
import messages_bs from './bs.json'
import messages_es from './es.json'
import messages_ru from './ru.json'
import parseLanguages, { formatMessage } from '../../utils/localeTools'

const messageSources = {
  de: messages_de,
  bs: messages_bs,
  es: messages_es,
  en: messages_en,
  ru: messages_ru,
}

const styles = theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
  },
  root: {
    flexGrow: 1,
    flex: '1 0 100%',
    // height: '100%',
    // overflow: 'hidden'
  },
  hero: {
    height: '100%',
    // minHeight: '80vh',
    flex: '0 0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    color:
      theme.palette.type === 'light'
        ? theme.palette.primary.dark
        : theme.palette.primary.main,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    letterSpacing: '.7rem',
    textIndent: '.7rem',
    fontWeight: theme.typography.fontWeightLight,
    [theme.breakpoints.only('xs')]: {
      fontSize: 24,
      letterSpacing: '.1em',
      textIndent: '.1rem',
    },
    whiteSpace: 'nowrap',
  },
  h5: {
    paddingLeft: theme.spacing(1) * 4,
    paddingRight: theme.spacing(1) * 4,
    marginTop: theme.spacing(1),
    maxWidth: 600,
    textAlign: 'center',
    [theme.breakpoints.only('xs')]: {
      fontSize: 18,
    },
  },
  content: {
    height: '100%',
    // paddingTop: theme.spacing(1) * 8,
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(1),
    },
  },
  button: {
    marginTop: theme.spacing(1) * 3,
  },
  logo: {
    color: 'red',
    margin: `${theme.spacing(1) * 3}px 0 ${theme.spacing(1) * 4}px`,
    width: '100%',
    height: '40vw',
    maxHeight: 250,
  },
  steps: {
    maxWidth: theme.spacing(1) * 130,
    margin: 'auto',
  },
  step: {
    padding: `${theme.spacing(1) * 3}px ${theme.spacing(1) * 2}px`,
  },
  stepIcon: {
    marginBottom: theme.spacing(1),
  },
  markdownElement: {},
  cardsContent: {
    padding: 15,
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    [theme.breakpoints.only('xs')]: {
      width: '100%',
      padding: 0,
      paddingTop: 15,
    },
  },
  card: {
    minWidth: 275,
    maxWidth: 350,
    margin: 15,
    [theme.breakpoints.only('xs')]: {
      width: '100%',
      margin: 0,
      marginTop: 7,
    },
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  cardTitle: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

const match = parseLanguages(['en', 'es', 'bs', 'ru', 'de'], 'en')

const LandingPage = ({ classes, history, theme }) => {
  const messages = messageSources[match]

  const isAuthorised = () => {
    try {
      const key = Object.keys(localStorage).find(e => e.match(/persist:root/))
      const data = JSON.parse(localStorage.getItem(key))
      const auth = JSON.parse(data.auth)

      return auth && auth.isAuthorised
    } catch (ex) {
      return false
    }
  }

  useEffect(() => {
    if (isAuthorised()) {
      history.push('/signin')
    }
  })

  return (
    <div className={classes.main}>
      <Helmet>
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content={theme.palette.primary.main}
        />
        <meta
          name="msapplication-navbutton-color"
          content={theme.palette.primary.main}
        />
        <title>{formatMessage(messages, 'main.title')}</title>
      </Helmet>

      <AppBar position="static">
        <Toolbar disableGutters>
          <div style={{ flex: 1 }} />

          <Tooltip id="tooltip-icon1" title="Sign in">
            <IconButton
              name="signin"
              aria-label="Sign in"
              color="inherit"
              onClick={() => {
                history.push('/signin')
              }}
              rel="noopener"
            >
              <LockIcon />
            </IconButton>
          </Tooltip>
          <Tooltip id="tooltip-icon2" title="Facebook group">
            <IconButton
              name="facebook"
              aria-label="Open Facebook"
              color="inherit"
              href="https://www.facebook.com/groups/364185134231386"
              target="_blank"
              rel="noopener"
            >
              <FacebookIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <div className={classes.root}>
        <div className={classes.hero}>
          <div className={classes.content}>
            <div className={classes.text}>
              <Typography
                variant="h3"
                align="center"
                component="h1"
                color="inherit"
                gutterBottom
                className={classes.title}
              >
                {formatMessage(messages, 'main.title')}
              </Typography>
              <Typography
                variant="h5"
                component="h2"
                color="inherit"
                gutterBottom
                className={classes.h5}
              >
                {formatMessage(messages, 'main.intro')}
              </Typography>
              <Button
                onClick={() => {
                  history.push('/signin')
                }}
                className={classes.button}
                variant="outlined"
                color="primary"
              >
                {formatMessage(messages, 'main.start')}
              </Button>
            </div>

            <div className={classes.cardsContent}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {formatMessage(messages, 'main.instal')}
                  </Typography>
                  <br />
                  <Typography>{formatMessage(messages, 'main.run')}</Typography>
                  <br />
                  <Typography className={classes.pos} color="textSecondary">
                    {' '}
                    npx create-react-app test-app --scripts-version
                    rmw-react-scripts{' '}
                  </Typography>
                </CardContent>
              </Card>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {formatMessage(messages, 'main.usage')}
                  </Typography>
                  <br />
                  <Typography>{formatMessage(messages, 'main.set')}</Typography>
                  <br />
                  <Typography className={classes.pos} color="textSecondary">
                    {"import App from 'rmw-shell'"}
                    <br />
                    {'<App appConfig={{ configureStore, ...config }} />'}
                  </Typography>
                </CardContent>
              </Card>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {formatMessage(messages, 'main.what')}
                  </Typography>
                  <Typography noWrap={false} color="textSecondary">
                    {formatMessage(messages, 'main.this')}

                    <br />
                    {formatMessage(messages, 'main.demo')}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      history.push('/signin')
                    }}
                  >
                    {formatMessage(messages, 'main.start')}
                  </Button>
                </CardActions>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

LandingPage.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default withRouter(withStyles(styles, { withTheme: true })(LandingPage))
