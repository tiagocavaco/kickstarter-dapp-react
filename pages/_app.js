import React from 'react';
import { GlobalStore } from '../context/store';
import Layout from "../components/layout";

const App = ({ Component, pageProps }) => {
  return (
    <React.StrictMode>
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