require('dotenv').config();

const pandascore = {
  apiBaseUri:
    process.env.PANDASCORE_API_BASEURI || 'https://api.pandascore.co/',
  apiToken: process.env.PANDASCORE_API_TOKEN,
};

const httpClient = {
  userAgent: process.env.USER_AGENT,
  maxDegreeOfParallelism: process.env.MAX_DEGREE_OF_PARALLELISM,
};

const cache = {
  durationInSeconds: process.env.CACHE_DURATION_SECONDS,
};

module.exports = {
  pandascore,
  httpClient,
  cache,
};
