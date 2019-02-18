const { getRequestOptions, getHttpClientOptions } = require('./options');

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

describe('options', () => {
  describe('getRequestOptions', () => {
    it('returns the default request options', () => {
      const expected = {
        headers: {
          'User-Agent': 'agent',
          Authorization: `Bearer token`,
        },
      };

      const options = getRequestOptions();

      expect(options).toMatchObject(expected);
    });

    it('returns the default request options merged with passed options', () => {
      const expected = {
        headers: {
          'User-Agent': 'another agent',
        },
        compress: false,
      };

      const options = getRequestOptions({
        headers: { 'User-Agent': 'another agent' },
        compress: false,
      });

      expect(options).toMatchObject(expected);
    });
  });

  describe('getHttpClientOptions', () => {
    it('returns the default httpclient options', () => {
      const expected = {
        apiBaseUri: 'http://localhost/',
      };

      const options = getHttpClientOptions();

      expect(options).toMatchObject(expected);
    });

    it('returns the default httpclient options merged with passed options', () => {
      const expected = {
        apiBaseUri: 'something_else',
        newProperty: 'value',
      };
      const options = getHttpClientOptions(expected);

      expect(options).toMatchObject(expected);
    });
  });
});
