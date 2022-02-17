require('dotenv').config();

module.exports = {
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  env: {
    INFURA_PROVIDER_URL: process.env.INFURA_PROVIDER_URL,
    INFURA_ID: process.env.INFURA_ID,
  },
};