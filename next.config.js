require('dotenv').config();

module.exports = {
  env: {
    PUBLIC_URL: "https://tiagocavaco.github.io/kickstarter-dapp-react",
    assetPrefix: "https://tiagocavaco.github.io/kickstarter-dapp-react/",
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    INFURA_PROVIDER_URL: process.env.INFURA_PROVIDER_URL,
    INFURA_ID: process.env.INFURA_ID,
  },
};