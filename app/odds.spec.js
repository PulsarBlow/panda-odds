const { matches } = require('./api');
const Match = require('./models/Match');
const { getLeagueRatings, getOddsForMatch } = require('./odds');

jest.mock('./api', () => ({
  matches: {
    getMatchAsync: jest.fn(),
    getLeagueMatchesAsync: jest.fn(),
  },
}));

describe('odds', () => {
  const teamA = {
    slug: 'teamA',
    name: 'TeamA',
    id: 1,
    acronym: 'TA',
  };
  const teamB = {
    slug: 'teamB',
    name: 'TeamB',
    id: 2,
    acronym: 'TB',
  };
  const leagueMatches = [
    new Match({
      id: 1,
      winner_id: teamA.id,
      results: [
        {
          team_id: teamA.id,
          score: 2,
        },
        {
          team_id: teamB.id,
          score: 1,
        },
      ],
      opponents: [
        {
          type: 'Team',
          opponent: teamA,
        },
        {
          type: 'Team',
          opponent: teamB,
        },
      ],
    }),
    new Match({
      id: 2,
      winner_id: teamA.id,
      results: [
        {
          team_id: teamA.id,
          score: 3,
        },
        {
          team_id: teamB.id,
          score: 0,
        },
      ],
      opponents: [
        {
          type: 'Team',
          opponent: teamA,
        },
        {
          type: 'Team',
          opponent: teamB,
        },
      ],
    }),
  ];

  describe('getLeagueRatings', () => {
    it.each([undefined, null, '', 0, []])(
      'returns empty Map when league matches is %p',
      leagueMatches => {
        const leagueRatings = getLeagueRatings(leagueMatches);
        expect(leagueRatings).not.toBeNull();
        expect(leagueRatings.size).toBe(0);
      }
    );

    it('returns expected ratings', () => {
      const leagueRatings = getLeagueRatings(leagueMatches);
      expect(leagueRatings).not.toBeNull();
      expect(leagueRatings.size).toBe(2);

      const ratingA = leagueRatings.get(teamA.id);
      expect(ratingA).toBe(1538);

      const ratingB = leagueRatings.get(teamB.id);
      expect(ratingB).toBe(1462);
    });
  });

  describe('getOddsForMatch', () => {
    matches.getLeagueMatchesAsync.mockReturnValue(leagueMatches);
    matches.getMatchAsync.mockReturnValue(
      new Match({
        id: 2,
        winner_id: null,
        league_id: 1,
        results: [
          {
            team_id: teamA.id,
            score: 0,
          },
          {
            team_id: teamB.id,
            score: 0,
          },
        ],
        opponents: [
          {
            type: 'Team',
            opponent: teamA,
          },
          {
            type: 'Team',
            opponent: teamB,
          },
        ],
      })
    );

    it('returns expected odds', async () => {
      const odds = await getOddsForMatch();
      expect(odds[teamA.name]).toBeCloseTo(60.766106);
      expect(odds[teamB.name]).toBeCloseTo(39.233894);
    });
  });
});
