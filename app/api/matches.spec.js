jest.mock('node-fetch');
jest.mock('../config', () => {
  const original = require.requireActual('../config');
  return {
    ...original,
    pandascore: {
      apiBaseUri: 'http://localhost/',
      apiToken: 'token',
    },
    httpClient: {
      userAgent: 'agent',
    },
  };
});
const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const Match = require('../models/Match');

const { getUpcomingMatchesAsync, getLeagueMatchesAsync } = require('./matches');
describe('matches', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  describe('getUpcomingMatchesAsync', () => {
    it('calls fetch with the right args and returns the upcoming matches', async () => {
      const expected = [
        {
          begin_at: '2018-11-04T14:38:30Z',
          id: 1,
          name: 'name',
        },
        {
          begin_at: '2018-11-04T14:38:30Z',
          id: 2,
          name: 'name',
        },
      ];
      fetch.mockReturnValue(
        Promise.resolve(new Response(JSON.stringify(expected)))
      );

      const matches = await getUpcomingMatchesAsync();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(matches).toMatchObject(expected);
    });

    it.each(['{}', JSON.stringify({ id: 123 })])(
      'returns an empty array when returned json is %p',
      async json => {
        fetch.mockReturnValue(Promise.resolve(new Response(json)));
        const matches = await getUpcomingMatchesAsync();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(matches).toEqual([]);
      }
    );
  });

  describe('getLeagueMatchesAsync', () => {
    it('calls fetch with the right args and returns the upcoming matches', async () => {
      const expectedPages = [
        [
          {
            begin_at: '2018-11-04T14:38:30Z',
            id: 1,
            name: 'name',
          },
        ],
        [
          {
            begin_at: '2018-11-04T14:38:30Z',
            id: 2,
            name: 'name',
          },
        ],
      ];

      fetch.mockReturnValueOnce(
        Promise.resolve(
          new Response(JSON.stringify(expectedPages[0]), {
            headers: { 'X-Page': 1, 'X-Per-Page': 1, 'X-Total': 2 },
          })
        )
      );
      fetch.mockReturnValueOnce(
        Promise.resolve(
          new Response(JSON.stringify(expectedPages[1]), {
            headers: { 'X-Page': 1, 'X-Per-Page': 1, 'X-Total': 2 },
          })
        )
      );

      const matches = await getLeagueMatchesAsync();

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(matches).toMatchObject([
        new Match(...expectedPages[0]),
        new Match(...expectedPages[1]),
      ]);
    });
  });
});
