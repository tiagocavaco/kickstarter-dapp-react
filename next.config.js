require('dotenv').config();

module.exports = {
  env: {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH,
    INFURA_PROVIDER_URL: process.env.INFURA_PROVIDER_URL,
    INFURA_ID: process.env.INFURA_ID,
  },
};