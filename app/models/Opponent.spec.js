const Opponent = require('./Opponent');

describe('Opponent', () => {
  it('maps data to its own properties', () => {
    const data = { id: 123, name: 'name', acronym: 'ABC' };
    const opponent = new Opponent('type', data);

    expect(opponent).not.toBeNull();
    expect(opponent.type).toBe('type');
    expect(opponent.id).toBe(123);
    expect(opponent.name).toBe('name');
    expect(opponent.acronym).toBe('ABC');
  });
  it('maps nothing when data is not provided', () => {
    const opponent = new Opponent();

    expect(opponent).not.toBeNull();
    expect(opponent.type).toBe('unknown');
    expect(opponent.id).toBeUndefined();
    expect(opponent.name).toBeUndefined();
    expect(opponent.acronym).toBeUndefined();
  });
});
