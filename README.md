[![CI](https://github.com/ericminio/yosethegame/actions/workflows/ci.yml/badge.svg)](https://github.com/ericminio/yosethegame/actions/workflows/ci.yml)

## working software

https://ericminio.github.io/yosethegame/app/web/assets/index.html

## running locally

```
nvm install
npm install
npm run start
```

## working on an old machine

```
cd .github/support
docker-compose run --service-ports --rm --name yosethegame dev bash
nvm install
npm install
npm test
```
