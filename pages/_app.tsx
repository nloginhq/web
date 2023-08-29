import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline, Themes } from '@geist-ui/core'

import './styles.css'

const nloginTheme = Themes.createFromDark({
  type: 'nloginTheme',
  palette: {
    success: '#f45500',
    secondary: '#1C1C1C',
    accents_6: '#FFF',
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GeistProvider themes={[nloginTheme]} themeType="nloginTheme">
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  )
}
export default MyApp
