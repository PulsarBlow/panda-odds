const fetch = require('node-fetch');
const { flatten } = require('lodash');

const { pandaHeaders } = require('../constants');
const BulkheadExecutor = require('./BulkheadExecutor');
const { getHttpClientOptions, getRequestOptions } = require('../api/options');

const getPageLink = (endpointUri, pageNumber, pageSize) =>
  `${endpointUri}${
    endpointUri.indexOf('?') === -1 ? '?' : ''
  }&page[number]=${pageNumber}&page[size]=${pageSize}`;

const getPaginationInfos = headers => {
  const page = parseInt(headers.get(pandaHeaders.X_PAGE) || 0, 10);
  const pageSize = parseInt(headers.get(pandaHeaders.X_PER_PAGE) || 0, 10);
  const total = parseInt(headers.get(pandaHeaders.X_TOTAL) || 0, 10);

  return {
    page,
    pageSize,
    total,
  };
};

const getPageLinkToFetch = (apiEndpointUri, paginationInfos) => {
  const { page, pageSize, total } = paginationInfos;
  const pagesToFetch = Math.round(total / pageSize);
  const links = [];
  for (let i = page + 1; i <= pagesToFetch; i++) {
    links.push(getPageLink(apiEndpointUri, i, pageSize));
  }
  return links;
};

class PandaPageFetcher {
  constructor(options) {
    this.bulkheadExecutor = new BulkheadExecutor(
      options.maxDegreeOfParallelism ||
        getHttpClientOptions().maxDegreeOfParallelism
    );
    this.pageSize = options.pageSize || 100;
    this.fetchOptions = options.fetchOptions || getRequestOptions();
  }

  async fetchAsync(apiEndpointUri, resultMapper) {
    // fetch first page to know what to do next
    const res = await fetch(
      getPageLink(apiEndpointUri, 1, this.pageSize),
      this.fetchOptions
    );
    let results = await res.json();

    // then fetch all other pages, using a bulkhead executor
    // to improve (partition) the event loop scheduling
    // if there is a lot of pages to fetch.
    const paginationInfos = getPaginationInfos(res.headers);
    const nextLinks = getPageLinkToFetch(apiEndpointUri, paginationInfos);
    const execResult = await this.bulkheadExecutor.executeAsync(async url => {
      const res = await fetch(url, this.fetchOptions);
      return res.json();
    }, nextLinks);
    results = [...results, ...flatten(execResult)];
    return results.map(r => resultMapper(r));
  }
}

module.exports = PandaPageFetcher;
