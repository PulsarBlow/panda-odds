const { isArray, isFunction, chunk } = require('lodash');

class BulkheadExecutor {
  constructor(maxDegreeOfParallelism) {
    this.maxDegreeOfParallelism = maxDegreeOfParallelism;
  }

  async executeAsync(asyncOperation, parameters) {
    if (!isFunction(asyncOperation)) {
      throw new Error('asyncOperation must be a function');
    }
    if (!isArray(parameters)) {
      throw new Error('parameters must be an array');
    }

    if (parameters.length === 0) {
      return [];
    }

    const chunks = chunk(parameters, this.maxDegreeOfParallelism);
    let result = [];
    for (let i = 0; i < chunks.length; i++) {
      result = [
        ...result,
        ...(await Promise.all(chunks[i].map(p => asyncOperation(p)))),
      ];
    }
    return result;
  }
}

module.exports = BulkheadExecutor;
