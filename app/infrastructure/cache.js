const { cache: cacheConfig } = require('../config');

const oddsCache = new Map();

const isOutdated = hrtime =>
  process.hrtime(hrtime) > cacheConfig.durationInSeconds;

const readOddsFromCache = matchId => {
  const odds = oddsCache.get(matchId);
  if (!odds) {
    return null;
  }
  if (isOutdated(odds.time)) {
    oddsCache.delete(matchId);
    return null;
  }
  return odds.value;
};

const writeOddsToCache = (matchId, odds) => {
  oddsCache.set(matchId, {
    time: process.hrtime(),
    value: odds,
  });
};

module.exports = {
  readOddsFromCache,
  writeOddsToCache,
};
