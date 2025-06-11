[![CI](https://github.com/ericminio/yosethegame/actions/workflows/ci.yml/badge.svg)](https://github.com/ericminio/yosethegame/actions/workflows/ci.yml)

## working software

https://yosethegame.com

## playing locally

```
nvm install
npm install
npm run server
```

## playing locally from command line

```
nvm install
npm install
npm run play <url>
```

### switch to playwright instead of jsdom

```
YOP_WEBTEST=playwright node app/console/play.js <url>
```

## working on an old machine

```
cd .github/support
docker-compose run --service-ports --rm --name yosethegame dev bash
nvm install
npm install
npx playwright install
npx playwright install-deps
npm test
```

Remember `npm run play http://host.docker.internal:<port>`
