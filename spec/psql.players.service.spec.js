var PSql = require('../app/lib/psql.database');
var pg = require('pg');
var dropAndCreateTablePlayers = require('../app/utils/database.drop.and.create.table.players');

describe('PostgreSql database', function() {

	var url = process.env.DATABASE_URL;
	var database = new PSql(url);
	var client;
	var max = { 
			login: 'max',
			name: 'max'
		};
	
    beforeEach(function(done) {
        dropAndCreateTablePlayers(url, function() {
            done();
        });
    });

	it('uses process.env.DATABASE_URL', function() {
		expect(url).toEqual(process.env.DATABASE_URL);
	});
	
	it('enjoys a env var', function() {
		expect(url).toBeDefined();
	});
 
	it('can create a player', function(done) {
		database.createPlayer(max, function() {
			database.find('max', function(player) {
				expect(player).toBeDefined();
				expect(player.name).toEqual('max');
				done();
			});
		});
	});
		
	it('preserves an already existing player', function(done) {
		database.createPlayer(max, function() {
			max.name = 'new name';
			database.createPlayer(max, function() {
				database.find('max', function(player) {
					expect(player).toBeDefined();
					expect(player.name).toEqual('max');
					done();
				});
			});
		});
	});
		
	it('does not create extra players', function(done) {
		database.createPlayer(max, function() {
			max.name = 'new name';
			database.createPlayer(max, function() {
					
				var client = new pg.Client(url);
				client.connect(function(err) {
					var sql = "select count(1) from players where login = 'max'";
					client.query(sql, function(err, result) {
						client.end();
						expect(result.rows[0].count).toEqual('1');
						done();
					});
				});
					
			});
		});
	});
		
	it('can modify a field', function(done) {
		database.createPlayer(max, function() {
			max.name = 'max';
			database.savePlayer(max, function() {
				database.find('max', function(player) {
					expect(player).toBeDefined();
					expect(player.name).toEqual('max');
					done();
				});				
			});
		});
	});	
	
	it('can add a new field', function(done) {
		database.createPlayer(max, function() {
			max.field = 'any';
			database.savePlayer(max, function() {
				database.find('max', function(player) {
					expect(player.field).toEqual('any');
					done();
				});				
			});
		});
	});
	
	it('returns undefined when the player is unknown', function(done) {
		database.find('any', function(player) {
			expect(player).toEqual(undefined);
			done();
		});				
	});
	
	describe('Retrieving all players', function() {
		
		it('is possible', function(done) {
			database.createPlayer(max, function() {
				database.allPlayers(function(players) {
					expect(players.length).toEqual(1);
					done();
				});
			});
		});

		it('returns full players', function(done) {
			max.field = 'any';
			database.createPlayer(max, function() {
				database.allPlayers(function(players) {
					expect(players[0].field).toEqual('any');
					done();
				});
			});
		});
		
		it('returns empty collection when there is no player', function(done) {
			database.allPlayers(function(players) {
				expect(players.length).toEqual(0);
				done();
			});
		});
		
		it('returns players order by score', function(done) {
			var clairette = { login: 'claire' };
			var poseidon = { login: 'poseidon' };
			var max = { login: 'max' };
			database.createPlayer(clairette, function() {
				database.createPlayer(poseidon, function() {
					database.createPlayer(max, function() {						
						clairette.score = 18;
						poseidon.score = 777;
						max.score = 999;						
						database.savePlayer(clairette, function() {
							database.savePlayer(poseidon, function() {
								database.savePlayer(max, function() {
									database.allPlayers(function(players) {
										expect(players[0].login).toEqual('max');
										done();
									});
								});
							});
						});
						
					});
				});
			});
		});
	});
	
	describe('Score:', function() {
	
		it('sets score to 0 when creating a player', function(done) {		
			database.createPlayer(max, function() {				
				client = new pg.Client(url);
				client.connect(function(err) {
					var sql = "select score from players where login = 'max'";
					client.query(sql, function(err, result) {
						client.end();						
						expect(err).toBe(null);
						if (err == null) {
							expect(result.rows[0].score).toEqual(0);
						}
						done();
					});
				});
			});			
		});
		
		it('updates the score of the player when saving a player', function(done) {
			database.createPlayer(max, function() {
				max.score = 42;
				database.savePlayer(max, function() {
					client = new pg.Client(url);
					client.connect(function(err) {
						var sql = "select score from players where login = 'max'";
						client.query(sql, function(err, result) {
							client.end();						
							expect(err).toBe(null);
							if (err == null) {
								expect(result.rows[0].score).toEqual(42);
							}
							done();
						});
					});
				});
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
	    var me = { login: 'me', field: 'any' };
	    var you = { login: 'you', field: 'any' };
		database.createPlayer(me, function() {
    		database.createPlayer(you, function() {
    		    me.score = 10;
    		    you.score = 20;
    		    database.savePlayer(me, function() {
    		        database.savePlayer(you, function() {
        			    database.getScoreCommunity(function(score) {
        				    expect(score).toEqual(30);
        				    done();
        			    });
    		        });
    		    });
			});
		});
	});
	
	it('sets creation date to now when creating a player', function(done) {		
		database.createPlayer(max, function() {				
			client = new pg.Client(url);
			client.connect(function(err) {
				var sql = "select extract(microseconds from now() - creation_date) as diff from players where login = 'max'";
				client.query(sql, function(err, result) {
					client.end();						
					expect(err).toBe(null);
					if (err == null) {
						expect(result.rows.length).toEqual(1);
						expect(result.rows[0].diff).toBeLessThan(1000000);
					}
					done();
				});
			});
		});			
	});
	
	describe('searching players matching a criteria', function() {
	    
    	it('returns only the players with the criteria somewhere in the json', function(done) {
    	    var me = { login: 'me', one: 'blue' };
    	    var you = { login: 'you', two: 'red' };
    		database.createPlayer(me, function() {
        		database.createPlayer(you, function() {
    			    database.findPlayersMatching('blue', function(players) {
    				    expect(players.length).toEqual(1);
    				    done();
    			    });
    			});
    		});
    	});

    	it('returns the matching players order by score desc', function(done) {
    	    var me = { login: 'me', one: 'blue' };
    	    var you = { login: 'you', two: 'blue'};
    		database.createPlayer(me, function() {
        		database.createPlayer(you, function() {
        		    me.score = 10;
        		    you.score = 20;
        		    database.savePlayer(me, function() {
        		        database.savePlayer(you, function() {
    			            database.findPlayersMatching('blue', function(players) {
    				            expect(players.length).toEqual(2);
    				            expect(players[0].login).toEqual('you');
    				            done();
    			            });
			            });
		            });
    			});
    		});
    	});
    	
    	it('works with special characters', function(done) {
    	    var me = { login: 'me', one: 'año' };
    	    var you = { login: 'you', two: 'red' };
    		database.createPlayer(me, function() {
        		database.createPlayer(you, function() {
    			    database.findPlayersMatching('año', function(players) {
    				    expect(players.length).toEqual(1);
    				    done();
    			    });
    			});
    		});
    	});
	});
	
	describe('prevents sql injection', function() {
    	it('when searching players', function(done) {
  			var me = { login: 'me', one: 'blue' };
            database.createPlayer(me, function() {
			    database.findPlayersMatching('', function(players) {
				    expect(players.length).toEqual(1);
                    database.findPlayersMatching("' ; DELETE FROM PLAYERS; select login, json from players where json like '%", function(players) {
                        database.findPlayersMatching('', function(players) {
                            expect(players.length).toEqual(1);
                            done();
                        });
                    });
				});
    		});		
    	});
	});
});