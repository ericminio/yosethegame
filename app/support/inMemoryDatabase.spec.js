var InMemoryDatabase = require('./inMemoryDatabase');

describe('InMemoryDatabase', function() {

    var database;
	
	beforeEach(function() {
		database = new InMemoryDatabase();
	});

	it('has an empty player collection by default', function() {
		expect(database.players.length).toEqual(0);
	});
	
	it('offers a way to find a player by login', function(done) {
		database.players = [
			{ login: 'one', name: 'bob' },
			{ login: 'two', name: 'max' }
		];
		database.find('two', function(player) {
			expect(player.name).toEqual('max');
			done();
		});
	});
	
	it('offers a friendly way to populate players', function() {
		var me = { login: 'me' };
		var database = new InMemoryDatabase().withPlayers([me]);
		
		expect(database.players[0]).toEqual(me);
	});
	
	it('updating a player needs no implementation thx to in-memory db', function(done) {
		var me = { login: 'me' };
		var database = new InMemoryDatabase().withPlayers([me]);
		me.name = 'eric';
		database.savePlayer(me, function(player) {
			database.find('me', function(player) {
				expect(player.name).toEqual('eric');
				done();
			});
		});		
	});
	
	it('offers a way to retrieves all the players', function(done) {
		database.players = [
			{ login: 'one', name: 'bob' },
			{ login: 'two', name: 'max' }
		];
		database.allPlayers(function(players) {
			expect(players.length).toEqual(2);
			done();
		});
	});
	
	it('offers a way to create a player', function(done) {
		var me = { login: 'me', field: 'any' };
		database.createPlayer(me, function() {
			database.find('me', function(player) {
				expect(player.field).toEqual('any');
				done();
			});
		});
	});
	
	it('offers a way to get the player count', function(done) {
        var me = { login: 'me', field: 'any' };
		database.createPlayer(me, function() {
			database.playerCount(function(count) {
				expect(count).toEqual(1);
				done();
			});
		});
	});
	
	it('offers a way to get the total score of the community', function(done) {
        var me = { login: 'me', field: 'blue', score:10 };
        var you = { login: 'you', field: 'red', score:20 };
		database.createPlayer(me, function() {
            database.createPlayer(you, function() {
                database.getScoreCommunity(function(score) {
                    expect(score).toEqual(30);
                    done();
                });
			});
		});
	});
	
	it('offers a way to find players matching a criteria', function(done) {
        var me = { login: 'me', field: 'blue', score:10 };
        var you = { login: 'you', field: 'red', score:20 };
        database.createPlayer(me, function() {
            database.createPlayer(you, function() {
                database.findPlayersMatching('blue', function(players) {
                    expect(players.length).toEqual(1);
                    expect(players[0].login).toEqual('me');
                    done();
                });
            });
        });
	});
	
	it('offers a way to add and retrieve the news', function(done) {
        var news = [ { first: 'one' }, { second: 'two' } ];
		database.addNews( news[0], function() {
            database.addNews( news[1], function() {
                database.getNews(function(received) {
                    expect(received).toEqual(news);
                    done();
                });
            });
        });
	});	
	
	it('adds the current date to the given news', function(done) {
		database.addNews( { any: 'value' }, function() {
            database.getNews(function(received) {
                expect(received[0].date.toString()).toEqual(new Date().toString());
                done();
            });
		});
	});
});