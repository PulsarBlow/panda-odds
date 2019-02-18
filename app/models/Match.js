const OpponentSet = require('./OpponentSet');

class Match {
  constructor(data = {}) {
    this.id = data.id;
    this.winnerId = data.winner_id;
    this.leagueId = data.league_id;
    this.name = data.name;
    this.begin_at = data.begin_at;
    this.opponents = new OpponentSet(data.opponents);
  }
}

module.exports = Match;
