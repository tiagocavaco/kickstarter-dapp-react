require('dotenv').config();

module.exports = {
  env: {
    INFURA_PROVIDER_URL: process.env.INFURA_PROVIDER_URL,
    INFURA_ID: process.env.INFURA_ID,
  },
};