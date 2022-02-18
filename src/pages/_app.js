import React from 'react';
import Head from "next/head";
import { GlobalStore } from '../context/store';
import { prefix } from '../helpers/prefix';
import Layout from "../components/layout";

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