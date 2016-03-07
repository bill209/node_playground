/*
	dadJokeSvc.js
	called from Alexa Skills app alexaDadJoke

	author: bill rowland
*/
(function(){

	var CFG = require('./dynamoDBConfig.js');	// initialize the database
	var Q = require('Q');

	var TABLENAME = 'dadJokes';					// dynamo DB table
	var FILENAME = 'data/dadjokes.json';		// file containing the jokes

	module.exports.getRandomDadJoke = function(){
		var deferred = Q.defer();

		getItemCount()							// cnt of jokes in db
			.then(function(numberOfJokes){
				// select a random joke
				var x = Math.floor((Math.random() * numberOfJokes) + 1);
				getDadJoke(x)					// get the joke
					.then(function(joke){
						deferred.resolve(joke);
					})
			})
		return deferred.promise;
	}

	// determine how many records in the table in order
	// to select a random one
	function getItemCount(){
		var deferred = Q.defer();

		var params = {
			TableName: TABLENAME,
		};

		CFG.db.describeTable(params, function(err, data) {
			if (err) deferred.reject(err, data);
			else deferred.resolve(data.Table.ItemCount);
		});
		return deferred.promise;
	}


	// retrieve a dad joke from the db
	// jokeIdx: index of joke to retrieve
	var getDadJoke = function(jokeIdx) {
		var deferred = Q.defer();

		var params = {
			TableName : TABLENAME,
			Key : { idx : jokeIdx }
		};

		CFG.dc.get(params, function(err, data) {
			if (err) {
				deferred.reject(err, data);
			} else {
				deferred.resolve(data.Item.joke);
			}
		});
		return deferred.promise;
	}


})();