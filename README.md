[![Travis Build Status](https://img.shields.io/travis/yosethegame/yosethegame/master.svg)](https://travis-ci.org/yosethegame/yosethegame)
[![Coverage Status](https://img.shields.io/coveralls/yosethegame/yosethegame/master.svg)](https://coveralls.io/r/yosethegame/yosethegame?branch=master)

You've got Nutella on your nose :) 

See it live: http://yosethegame.com

### local install

* install PostgreSql (9.3.x), Nodejs (0.10.x)
* create a database
* set env variable DATABASE_URL to something like postgres://{user}@localhost/{db}
* install dependencies: npm install
* check your install (run twice to create the tables during the first run): jasmine-node app
* run yose: node app/lib/web.js
* access yose: http://localhost:5000

The user ericminio is created at startup.

### with docker

* docker build -t yoseserver .
* docker run -p 5000:5000 -d yoseserver
* docker ps -> pid
* docker exec -it <pid> /bin/bash
* node app/lib/web.js