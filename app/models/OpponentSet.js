const Opponent = require('./Opponent');

class OpponentSet {
  constructor(data = []) {
    this._opponents = [];
    if (data || data.length !== 0) {
      data.map(item =>
        this._opponents.push(new Opponent(item.type, item.opponent))
      );
    }
  }

  get home() {
    return this._opponents[0] || null;
  }

  get away() {
    return this._opponents[1] || null;
  }
}

module.exports = OpponentSet;
