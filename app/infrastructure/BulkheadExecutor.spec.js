const BulkExecutor = require('./BulkheadExecutor');

describe('BulkExecutor', () => {
  describe('executeAsync', () => {
    it('returns expected', async () => {
      const expected = ['a', 'b', 'c', 'd'];
      const executor = new BulkExecutor(4);
      const asyncOperation = value => Promise.resolve(value);
      const result = await executor.executeAsync(asyncOperation, expected);
      expect(result).toEqual(expected);
    });

    it.each([null, undefined, 1, ''])(
      'throws when asyncOperation is %s',
      async value => {
        expect.assertions(1);
        const executor = new BulkExecutor(2);
        await expect(executor.executeAsync(value, [])).rejects.toThrow();
      }
    );

    it.each([null, undefined, 1, ''])(
      'throws when parameters is %s',
      async value => {
        expect.assertions(1);
        const executor = new BulkExecutor(2);
        const asyncOperation = value => Promise.resolve(value);
        await expect(
          executor.executeAsync(asyncOperation, value)
        ).rejects.toThrow();
      }
    );
  });
});
