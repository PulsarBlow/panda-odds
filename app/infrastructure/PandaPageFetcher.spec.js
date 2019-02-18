const fetch = require('node-fetch');
const PandaPageFetcher = require('./PandaPageFetcher');

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
const { Response } = jest.requireActual('node-fetch');

describe('PandaPageFetcher', () => {
  const fetchOptions = {
    headers: {
      Authorization: 'Bearer token',
      'User-Agent': 'agent',
    },
  };

  beforeEach(() => {
    fetch.mockClear();
  });

  describe('fetchAsync', () => {
    it('calls fetch with the right args and returns flattened mapped results', async () => {
      const page1 = [
        {
          begin_at: '2018-11-04T14:38:30Z',
          id: 1,
          name: 'name',
        },
      ];
      const page2 = [
        {
          begin_at: '2018-11-04T14:38:30Z',
          id: 2,
          name: 'name',
        },
      ];

      fetch.mockReturnValueOnce(
        Promise.resolve(
          new Response(JSON.stringify(page1), {
            headers: { 'X-Page': 1, 'X-Per-Page': 1, 'X-Total': 2 },
          })
        )
      );
      fetch.mockReturnValueOnce(
        Promise.resolve(
          new Response(JSON.stringify(page2), {
            headers: { 'X-Page': 2, 'X-Per-Page': 1, 'X-Total': 2 },
          })
        )
      );

      const fetcher = new PandaPageFetcher({ pageSize: 1 });
      const results = await fetcher.fetchAsync('http://localhost/api', r => r);

      expect(fetch).toHaveBeenNthCalledWith(
        1,
        'http://localhost/api?&page[number]=1&page[size]=1',
        fetchOptions
      );
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        'http://localhost/api?&page[number]=2&page[size]=1',
        fetchOptions
      );
      expect(results).toMatchObject([...page1, ...page2]);
    });
  });
});
