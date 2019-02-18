const { round } = require('lodash');
const { matches } = require('./api');
const EloCalculator = require('./EloCalculator');

const defaultRating = 1500;

const getLeagueRatings = leagueMatches => {
  const leagueRatings = new Map();
  if (!leagueMatches || !leagueMatches.length) {
    return leagueRatings;
  }

  const calculator = new EloCalculator();

  leagueMatches.forEach(match => {
    const { id: teamHomeId } = match.opponents.home;
    const { id: teamAwayId } = match.opponents.away;
    const teamHomeRating = leagueRatings.get(teamHomeId) || defaultRating;
    const teamAwayRating = leagueRatings.get(teamAwayId) || defaultRating;
    const winExpHome = EloCalculator.getWinExpectancy(
      teamHomeRating,
      teamAwayRating
    );
    const winExpAway = 1 - winExpHome;
    const teamHomeNewRating = calculator.getNewRating(
      teamHomeRating,
      match.winnerId === teamHomeId ? 1 : 0,
      winExpHome
    );
    const teamAwayNewRating = calculator.getNewRating(
      teamAwayRating,
      match.winnerId === teamAwayId ? 1 : 0,
      winExpAway
    );

    leagueRatings.set(teamHomeId, teamHomeNewRating);
    leagueRatings.set(teamAwayId, teamAwayNewRating);
  });

  return leagueRatings;
};

const getOddsForMatch = async matchId => {
  //  1. get match
  //  2. get finished matches for the league this match belongs
  //  3. compute league rankings
  //     TODO: rankings by year would be better
  //  4. compute win expectancy (odds) based on league rankings
  //     TODO: use previous season only
  const match = await matches.getMatchAsync(matchId);
  const leagueMatches = await matches.getLeagueMatchesAsync(match.leagueId);
  const leagueRatings = getLeagueRatings(leagueMatches);

  const { id: teamHomeId, name: teamHomeName } = match.opponents.home;
  const { id: teamAwayId, name: teamAwayName } = match.opponents.away;

  const teamHomeRating = leagueRatings.get(teamHomeId) || defaultRating;
  const teamAwayRating = leagueRatings.get(teamAwayId) || defaultRating;

  const teamHomeWinExp = EloCalculator.getWinExpectancy(
    teamHomeRating,
    teamAwayRating
  );
  const teamAwayWinExp = 1 - teamHomeWinExp;

  return {
    [teamHomeName]: round(teamHomeWinExp * 100, 6),
    [teamAwayName]: round(teamAwayWinExp * 100, 6),
  };
};

module.exports = {
  getLeagueRatings,
  getOddsForMatch,
};
