class Opponent {
  constructor(type, data = {}) {
    this.type = type || 'unknown';
    this.id = data.id;
    this.name = data.name;
    this.acronym = data.acronym;
  }
}

module.exports = Opponent;
