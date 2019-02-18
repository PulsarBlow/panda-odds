const { matches } = require('./api');
const { upcomingMatches, oddsForMatch } = require('./panda');
const {
  readOddsFromCache,
  writeOddsToCache,
} = require('./infrastructure/cache');
const { getOddsForMatch } = require('./odds');

jest.mock('./api', () => ({
  matches: {
    getUpcomingMatchesAsync: jest.fn(),
  },
}));
jest.mock('./infrastructure/cache', () => ({
  readOddsFromCache: jest.fn(),
  writeOddsToCache: jest.fn(),
}));

jest.mock('./odds', () => ({
  getOddsForMatch: jest.fn(),
}));

describe('panda', () => {
  describe('upcomingMatches', () => {
    it('returns sorry message when api returns no upcoming matches', async () => {
      matches.getUpcomingMatchesAsync.mockReturnValue([]);
      const result = await upcomingMatches();
      expect(result).toEqual(expect.stringContaining('Sorry'));
    });

    it('returns formatted match result when api returns upcoming matches', async () => {
      matches.getUpcomingMatchesAsync.mockReturnValue([
        {
          begin_at: '2017-07-02T15:00:00Z',
          id: 9052,
          name: 'DP-vs-GAL',
        },
        {
          begin_at: '2017-07-02T15:00:00Z',
          id: 9506,
          name: 'RB-vs-PSG',
        },
      ]);

      const result = await upcomingMatches();
      expect(result).toEqual(
        'begin_at: 2017-07-02T15:00:00Z, id: 9052, name: DP-vs-GAL\nbegin_at: 2017-07-02T15:00:00Z, id: 9506, name: RB-vs-PSG\n'
      );
    });
  });

  describe('oddsForMatch', () => {
    it('returns from cache when cache exists', async () => {
      const expected = { TeamA: 100, TeamB: 0 };
      readOddsFromCache.mockReturnValue(expected);

      const odds = await oddsForMatch(1);
      expect(odds).toMatchObject(expected);
      expect(readOddsFromCache).toHaveBeenCalledWith(1);
    });

    it('returns from api and write to cache when cache does not exist', async () => {
      const expected = { TeamA: 100, TeamB: 0 };
      readOddsFromCache.mockReturnValue(undefined);
      getOddsForMatch.mockReturnValue(expected);

      const odds = await oddsForMatch(1);
      expect(odds).toMatchObject(expected);
      expect(getOddsForMatch).toHaveBeenCalledWith(1);
      expect(writeOddsToCache).toHaveBeenCalledWith(1, expected);
    });
  });
});
