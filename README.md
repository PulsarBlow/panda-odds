# Panda Odds

[PandaScore](https://pandascore.co/) is the data provider of e-sport (The e-sport data API)

Panda Odds is a Proof-of-Concept app to fetch data from PandaScore API and generate match odds.

This is a NodeJs app.

## Getting started

You will need [Node 8+](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/lang/en/).

1. Create an `.env` file using the `.env.example`. Configure your PandaScore API token.
2. Install packages : `yarn`
3. Run one of the following commands :

`yarn upcoming_matches`  
To return a list of upcoming matches

`yarn match_for_odds 9493`  
To compute odds for a given match id (here matchId 9493 but you can change it to any existing matchId)

## Dev & Test

`yarn test --coverage`

To execute tests and see the current test coverage

## Odds computation algorithm

For a given match (matchId):

1. get match from PandaScore's API
2. get finished matches for the league this match belongs to
3. compute league rankings using a ELO rating  
   // TODO: rankings by year would be better
4. compute win expectancy (odds) based on league rankings  
   // TODO: use previous season only

### Flaws or possible improvements

- We should limit the match set to the previous season only (not all the league history)
- We should define home and away using smart factors (team country of residence, matches location - fans can come to assist and support)
- We should include players changes between seasons (new players, player historical data, player health, nb of game played etc.)
- We should compute team strengths using player stats
- We could improve ELO K factor using the something like http://www.eloratings.net/about
- Algorithm does not take into account the "best of" rule, this could be used to compute new ratings (3/0=1, 2/1=0.75, ...)
