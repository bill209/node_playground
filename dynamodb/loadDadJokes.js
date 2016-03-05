/*
	loads jokes into the dadJokes db
	input: dadjokes.json
	db: dynamodb:dadJokes

	to re-initialize db - run initJokesDB.js

	author: bill rowland
*/
(function(){

	var CFG = require('./dynamoDBConfig.js');	// initialize the database

	var FS = require('fs');						// reading the json file
	var Q = require('q');						// handling promises
	var TABLENAME = 'dadJokes';					// dynamo DB table
	var FILENAME = 'data/dadjokes.json';		// file containing the jokes

	// get the jokes from the json file
	readFile(FILENAME)
		.then(function(data){
			// convert the jokes into a format consumable by batchwrite
			jokes = convertJson(JSON.parse(data));
			// add jokes to dynamodb using batchwrite
			addJokes(jokes)
			.then(function(res){
				console.log("result: ",res);
			})
			.fail(function(error){
				console.log('error in test: ', JSON.stringify(error, null, 2));
			})
		.fail(function(error){
			console.log('error in readFile: ', JSON.stringify(error, null, 2));
		})
	});

	// get the jokes from the json file
	function readFile(fname){
		var deferred = Q.defer();

		FS.readFile(fname, 'utf8', function (error, text) {
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(text);
			}
		});
		return deferred.promise;
	}

	// convert the jokes into a format consumable by batchwrite
	function convertJson(d){
		var deferred = Q.defer();
		var batchJson = {};

		batchJson.RequestItems = {};
		batchJson.RequestItems.dadJokes = [];

		for(var i=0, len=d.jokes.length; i < len; i++){
 			batchJson.RequestItems.dadJokes[i] = {}
 			batchJson.RequestItems.dadJokes[i].PutRequest={};
 			batchJson.RequestItems.dadJokes[i].PutRequest.Item={};
 			batchJson.RequestItems.dadJokes[i].PutRequest.Item.idx = i+1;
 			batchJson.RequestItems.dadJokes[i].PutRequest.Item.joke = d.jokes[i].joke;
		}
		return batchJson;
	}

	// add jokes to dynamodb using batchwrite
	function addJokes(jokes){
		var deferred = Q.defer();
		var UnprocessedItems = jokes;

 		console.log(JSON.stringify(UnprocessedItems,null,2));
 		ctr = 0;
		do {
			ctr ++;	// loop through maximum 5 times
			CFG.dc.batchWrite(jokes, function(err, data) {
				if(!err) {
					jokes = data.UnprocessedItems;
				}
			});
		}
		// break on err, no more jokes to process, or tried 5 times
		while (!err && Object.keys(jokes).length > 0 && ctr < 5 && false)

		if(err){
			deferred.reject(err);
		} else if (ctr > 4) {
			deferred.reject({ 'error': 'batchwrite failed due to excessive attempts' });
		} else {
			deferred.resolve({'success' : true })
		}
		return deferred.promise;
	}

})();