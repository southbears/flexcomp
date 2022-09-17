import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { hotjar } from 'react-hotjar';
import { isSSR } from '../src/isSSR';
import '../styles/globals.css';

if (!isSSR) {
  hotjar.initialize(3162077, 6);
}

const theme = extendTheme({
  colors: {
    blue: {
      50: '#EBEFFE',
      100: '#B5C4FC',
      200: '#7F99FB',
      300: '#5F80FA',
      400: '#486FF9',
      500: '#3761F9',
      600: '#2D4EC9',
      700: '#243EA1',
      800: '#1C317E',
      900: '#15255F',
    },
  },
  config: {
    useSystemColorMode: true,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>FlexComp</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
