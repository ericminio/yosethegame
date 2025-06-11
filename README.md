[![CI](https://github.com/ericminio/yosethegame/actions/workflows/ci.yml/badge.svg)](https://github.com/ericminio/yosethegame/actions/workflows/ci.yml)

## Working software

[yosethegame.com](https://yosethegame.com)

The online game uses jsdom to challenge your server. Some limitations are those of jsdom.

To use playwright, play from console (see below).

## Playing with playwright

```
nvm install
npm install
npm run play <url>
```

## Working on an old machine

```
cd .github/support
docker-compose run --service-ports --rm --name yosethegame dev bash
nvm install
npm install
npx playwright install
npx playwright install-deps
npm test
```

And maybe

```
npm run play http://host.docker.internal:<port>
```
