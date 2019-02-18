const fetch = require('node-fetch');
const { isArray } = require('lodash');

const { getRequestOptions, getHttpClientOptions } = require('./options');
const PandaPageFetcher = require('../infrastructure/PandaPageFetcher');
const Match = require('../models/Match');

const getUpcomingMatchesAsync = async (limit = 5) => {
  const res = await fetch(
    `${getHttpClientOptions().apiBaseUri}/matches/upcoming?page[size]=${limit}`,
    getRequestOptions()
  );
  const json = await res.json();
  if (!isArray(json)) {
    return [];
  }
  return json.map(item => new Match(item));
};

const getMatchAsync = async matchId => {
  const res = await fetch(
    `${getHttpClientOptions().apiBaseUri}/matches/${matchId}`,
    getRequestOptions()
  );
  return new Match(await res.json());
};

const getLeagueMatchesAsync = async (
  leagueId,
  pageSize = 100,
  hasFinished = true
) => {
  const apiEndpointUri = `${
    getHttpClientOptions().apiBaseUri
  }/leagues/${leagueId}/matches${
    hasFinished ? '?filter[status]=finished' : ''
  }`;
  const pageFetcher = new PandaPageFetcher({
    pageSize,
  });
  return await pageFetcher.fetchAsync(apiEndpointUri, r => new Match(r));
};

module.exports = {
  getUpcomingMatchesAsync,
  getMatchAsync,
  getLeagueMatchesAsync,
};
