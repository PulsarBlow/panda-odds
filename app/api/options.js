const { pandascore, httpClient } = require('../config');

const { apiBaseUri, apiToken } = pandascore;
const { userAgent } = httpClient;

const defaultRequestOptions = {
  headers: {
    ...(userAgent ? { 'User-Agent': userAgent } : {}),
    ...(apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
  },
};

const getRequestOptions = (options = {}) => ({
  ...defaultRequestOptions,
  ...options,
});

const getHttpClientOptions = (options = {}) => ({
  apiBaseUri,
  ...options,
});

module.exports = {
  getRequestOptions,
  getHttpClientOptions,
};
