import { startI18n } from '../i18n';
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  const { trans, locale, isServer } = pageProps;
  if (isServer) startI18n(trans, locale)
  return <Component {...pageProps} />
}

export default MyApp
