const OpponentSet = require('./OpponentSet');

describe('OpponentSet', () => {
  it('maps data to its own properties', () => {
    const data = [
      {
        type: 'Team',
        opponent: {
          id: 89,
          name: 'DetonatioN FocusMe',
          acronym: 'DFM',
        },
      },
      {
        type: 'Team',
        opponent: {
          id: 33,
          name: 'KaBuM eSports',
          acronym: 'KBM',
        },
      },
    ];
    const set = new OpponentSet(data);

    expect(set).not.toBeNull();
    expect(set._opponents).toHaveLength(2);
    expect(set.home).toMatchObject(data[0].opponent);
    expect(set.away).toMatchObject(data[1].opponent);
  });

  it('maps nothing when data is not provided', () => {
    const set = new OpponentSet();

    expect(set).not.toBeNull();
    expect(set._opponents).toHaveLength(0);
  });

  describe('opponentHome', () => {
    it('returns null when home opponent is missing', () => {
      const set = new OpponentSet();

      expect(set).not.toBeNull();
      expect(set.home).toBeNull();
    });
  });
  describe('opponentAway', () => {
    it('returns null when away opponent is missing', () => {
      const set = new OpponentSet();

      expect(set).not.toBeNull();
      expect(set.away).toBeNull();
    });
  });
});
