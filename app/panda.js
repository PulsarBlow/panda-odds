const { isArray } = require('lodash');
const { matches } = require('./api');
const { getOddsForMatch } = require('./odds');
const {
  readOddsFromCache,
  writeOddsToCache,
} = require('./infrastructure/cache');

const upcomingMatches = async () => {
  const result = await matches.getUpcomingMatchesAsync();
  if (!isArray(result) || result.length === 0) {
    return 'Sorry, no upcoming matches at this time';
  }

  return result
    .map(
      match =>
        `begin_at: ${match.begin_at}, id: ${match.id}, name: ${match.name}`
    )
    .reduce((acc, s) => `${acc}${s}\n`, '');
};

const oddsForMatch = async matchId => {
  let odds = readOddsFromCache(matchId);
  if (odds) {
    return odds;
  }

  odds = await getOddsForMatch(matchId);
  writeOddsToCache(matchId, odds);

  return odds;
};

module.exports = {
  upcomingMatches,
  oddsForMatch,
};
