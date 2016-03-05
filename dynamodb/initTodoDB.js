(function(){

	var CFG = require('./dynamoDBConfig.js');

	var async = require('async');
	var TABLENAME = 'testone';
	var INDEXNAME = 'idx';
	var tasks = [];

	var tableDef = {
		TableName : TABLENAME,
		KeySchema: [
			{ AttributeName: INDEXNAME, KeyType: "HASH" },  //Partition key
		],
		AttributeDefinitions: [
			{ AttributeName: INDEXNAME, AttributeType: "N" }  //N = number
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 1, //Read/Writes per second
			WriteCapacityUnits: 1
		}
	};

	var itemone = {
		Item: {
			idx: {
				N: '1'
			},
			item: {
				S: "bake a pie"
			}
		},
		TableName: TABLENAME
	};

	var itemtwo = {
		Item: {
			idx: {
				N: '2'
			},
			item: {
				S: "clean the oven"
			}
		},
		TableName: TABLENAME
	};

	console.log("\ngo\n");

	tasks.push(function(callback){ scan(callback);});
	// tasks.push(function(callback){ createTable(tableDef, callback);});
	// tasks.push(function(callback){ putItem(itemone, callback);});

	async.series(tasks,
	function(e,r){
		if(e){
			console.log('error: ',e);
		} else{
			console.log(JSON.stringify(r,null,2));
		}
	});

	function createTable(params, callback){
		CFG.db.createTable(params, function(error, data) {
			callback(error, data);
		});
	}

	function putItem(params, callback){
		CFG.db.putItem(params, function (error, data) {
			callback(error,"putitem: " + data);
		});
	}

	function scan(callback){
		var params = {
			TableName: TABLENAME,
			Select: 'ALL_ATTRIBUTES'
		};
		CFG.db.scan(params, function(error, data) {
			callback(error, data);
		});
	}

})();
