const Match = require('./Match');

describe('Match', () => {
  it('maps data to its own properties', () => {
    const data = { id: 123, name: 'name', begin_at: '2018-11-04T14:38:30Z' };
    const match = new Match(data);

    expect(match).not.toBeNull();
    expect(match.id).toBe(123);
    expect(match.name).toBe('name');
    expect(match.begin_at).toBe('2018-11-04T14:38:30Z');
    expect(match.opponents).toBeDefined();
  });
  it('maps nothing when data is not provided', () => {
    const match = new Match();

    expect(match).not.toBeNull();
    expect(match.id).toBeUndefined();
    expect(match.name).toBeUndefined();
    expect(match.begin_at).toBeUndefined();
    expect(match.opponents).toBeDefined();
  });
});
