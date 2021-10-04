import { startI18n } from '../i18n';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const { trans, locale } = pageProps;
  if (process.browser) startI18n(trans, locale)
  return <Component {...pageProps} />
}

export default MyApp
