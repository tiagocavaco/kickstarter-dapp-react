import React from 'react';
import { GlobalStore } from '../context/store';
import Layout from "../components/layout";
import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <React.StrictMode>
      <Head>
        <title>Kickstarter - DApp</title>
      </Head>
      <GlobalStore>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalStore>
      <style>{`
        html,
        body {
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </React.StrictMode>
  );
}

export default App;