import React from 'react';
import { GlobalStore } from '../context/store';
import Layout from "../components/layout";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <React.StrictMode>
      <Head>
        <title>Kickstarter</title>
      </Head>
      <GlobalStore>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalStore>
    </React.StrictMode>
  );
}

export default App;