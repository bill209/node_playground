(function(){

	var CFG = require('./dynamoDBConfig.js');

	var async = require('async');
	var FS = require('fs');
	var Q = require('q');
	var TABLENAME = 'dadJokes';
	var FILENAME = 'data/dadjokes.json';
	var tasks = [];

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


console.log('\n--------------------------\n');
	readFile(FILENAME)
		.then(function(data){
			jokes = convertJson(JSON.parse(data));
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

	function addJokes(jokes){
		var deferred = Q.defer();
		var UnprocessedItems = jokes;
//console.log('UI len::::::', Object.keys(UnprocessedItems).length);
console.log('**: ',Object.size(UnprocessedItems));

 		console.log(JSON.stringify(UnprocessedItems,null,2));
 		ctr = 0;
		do {
			ctr ++;	// loop through maximum 5 times
			CFG.dc.batchWrite(UnprocessedItems, function(err, data) {
				if(err) {
					deferred.reject({ 'error' : 'batchwrite failed' });
				} else {
					jokes = UnprocessedItems;

console.log('jokes len: ', Object.size(jokes));
console.log('jokes: ', jokes);
				}
			});
		}
		while (!err && ctr < 5 && false)

		if(err){
			deferred.reject({ 'error': 'batchwrite failed' });
		} else {
			deferred.resolve({'success' : true })
		}
		return deferred.promise;
	}

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





})();