// based on http://www.eloratings.net/about
const defaultK = 40;
class EloCalculator {
  constructor(k = defaultK) {
    this._k = k;
  }

  get K() {
    return this._k;
  }

  set K(k) {
    this._k = k;
  }

  static get defaultK() {
    return defaultK;
  }

  static getWinExpectancy(ratingA, ratingB) {
    return 1 / (Math.pow(10, -(ratingA - ratingB) / 400) + 1);
  }

  getNewRating(currentRating, matchResult, winExpectancy) {
    // match result (1:win, 0.5:draw, 0:loss)
    return Math.round(currentRating + this._k * (matchResult - winExpectancy));
  }
}

module.exports = EloCalculator;
