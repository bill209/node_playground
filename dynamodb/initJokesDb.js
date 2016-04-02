
(function(){

	var CFG = require('./dynamoDBConfig.js');

	var async = require('async');
	var TABLENAME = 'dadJokes';
	var INDEXNAME = 'idx';
	var tasks = [];

//	tasks.push(function(callback){ deleteTable(callback)});
//	tasks.push(function(callback){ createTable(callback)});
	tasks.push(function(callback){ listTables(callback)});

	console.log('\n--------------------------\n');
	async.series(tasks, function(err, data){
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log('***\n',JSON.stringify(data,null,2),'***\n');
	})

	// --------------------------------------------------- list tables
	function listTables(callback){
		CFG.db.listTables(function (err, data) {
			if (err) callback(err, data);
			else callback(null, data);
		});
	}

	// --------------------------------------------------- delete table
	function deleteTable(callback){
		var params = {
			TableName: TABLENAME
		};
		CFG.db.deleteTable(params, function(err, data) {
			// ignore error if db does not exist
			if (err && err.statusCode != 400) callback(err, data);
			else callback(null, data);
		});
	}

	// --------------------------------------------------- create a table
	function createTable(callback){
		//params format
		var params = {
			TableName : TABLENAME,
			KeySchema: [
				{ AttributeName: INDEXNAME, KeyType: "HASH" },
			],
			AttributeDefinitions: [
				{ AttributeName: INDEXNAME, AttributeType: "N" }
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1
			}
		};

		CFG.db.createTable(params, function(err, data) {
			if (err) callback(err, data);
			else callback(null, data);
		});
	}
})();
