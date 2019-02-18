/* eslint no-console:off */
const { upcomingMatches, oddsForMatch } = require('./app/panda');

const args = process.argv;
console.log('args', args);

if (args[2] === 'upcoming_matches') {
  upcomingMatches().then(
    r => {
      console.log(r);
    },
    err => {
      console.error(err);
    }
  );
} else if (args[2] === 'odds_for_match') {
  const matchId = parseInt(process.argv[3], 10);
  if (isNaN(matchId)) {
    console.log(
      'Invalid matchId - Please use a command like `yarn odds_for_match 9493`'
    );
    return;
  }

  oddsForMatch(matchId).then(
    r => {
      console.log(r);
    },
    err => {
      console.error(err);
    }
  );
}
