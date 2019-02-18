const EloCalculator = require('./EloCalculator');

describe('EloCalculator', () => {
  describe('constructor', () => {
    it('sets the default K value', () => {
      const calc = new EloCalculator();
      expect(calc.K).toBe(EloCalculator.defaultK);
    });
    it('sets the given k value', () => {
      const expected = 10;
      const calc = new EloCalculator(expected);
      expect(calc._k).toBe(expected);
    });
  });

  describe('K accessors', () => {
    it('sets the given K value', () => {
      const expected = 100;
      const calc = new EloCalculator();
      calc.K = expected;
      expect(calc.K).toBe(expected);
    });
  });

  describe('getWinExpectancy', () => {
    it.each([
      [0, 0.5],
      [10, 0.486],
      [20, 0.471],
      [30, 0.457],
      [40, 0.443],
      [50, 0.429],
      [60, 0.415],
      [100, 0.36],
      [400, 0.091],
      [800, 0.01],
    ])(
      'returns expected win expectancy (rd: %p, we: %p)',
      (ratingDifference, expected) => {
        const ratingA = 1500;
        const ratingB = 1500 + ratingDifference;
        const winExpectancy = EloCalculator.getWinExpectancy(ratingA, ratingB);

        expect(winExpectancy).toBeCloseTo(expected);
      }
    );
  });
  describe('getNewRating', () => {
    it.each([
      // currentRating, matchResult, winExpectancy, expectedRating
      [1500, 1500, 1, 1],
      [1540, 1500, 1, 0],
      [1460, 1500, 0, 1],
    ])(
      'returns %s when current rating is %s with match result %s and win expectancy %s',
      (expected, currentRating, matchResult, winExpectancy) => {
        const calc = new EloCalculator();
        expect(
          calc.getNewRating(currentRating, matchResult, winExpectancy)
        ).toBe(expected);
      }
    );
  });
});
