import React from 'react';
import { GlobalStore } from '../context/store';
import Layout from "../components/layout";
import Head from "next/head";
import { prefix } from '../helpers/prefix';

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Kickstarter</title>
        <link rel="icon" href={`${prefix}/favicon.ico`} />
      </Head>
      <GlobalStore>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalStore>
    </>
  );
}

export default App;