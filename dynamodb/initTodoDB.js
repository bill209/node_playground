(function(){

var async = require('async');
var table_name = 'todoTbl';
var index_name = 'idx';
var tasks = [];

var dynDBConfig = {
	"accessKeyId": "DummyKeyForLocalDynamoDB",
	"secretAccessKey": "DummySecretAccessKeyForLocalDynamoDB",
	"region": "us-east-1",
	"aws_access_key_id": "omit",
	"aws_secret_access_key": "omit"
};

// requiring aws-sdk, async
var AWS = require('aws-sdk');
var async = require('async');

// For Local DynamoDB define endpoint will be "http://localhost:8000"
var dbConfig = {"endpoint": new AWS.Endpoint("http://localhost:8000")};

// provide your configurations
AWS.config.update(dynDBConfig);
// initialize DynamoDB Object.
var dynamoDB = new AWS.DynamoDB(dbConfig);
var docClient = new AWS.DynamoDB.DocumentClient();


var tableDef = {
	TableName : table_name,
	KeySchema: [
		{ AttributeName: index_name, KeyType: "HASH" },  //Partition key
	],
	AttributeDefinitions: [
		{ AttributeName: index_name, AttributeType: "N" }  //N = number
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
	TableName: table_name
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
	TableName: table_name
};



console.log("\ngo\n");

function createTable(params, cback){

	dynamoDB.createTable(params, function(error, data) {
		cback(error, data);
	});
}

function putItem(params, cback){
	dynamoDB.putItem(params, function (error, data) {
		cback(error,"putitem: " + data);
	});
}

function scan(cback){
	var params = {
		TableName: table_name,
		Select: 'ALL_ATTRIBUTES'
	};
	dynamoDB.scan(params, function(error, data) {
		cback(error, data);
	});
}

async.series([
	function(callback){ createTable(tableDef, callback);},
	function(callback){ putItem(itemone, callback);},
	function(callback){ putItem(itemtwo, callback);},
	function(callback){ scan(callback);},
	],
function(e,r){
	if(e){
		console.log('e: ',e);
	} else{
		for(var i=0;i<r.length;i++){
			console.log(i + ': ', r[i]);
		}
	}
});


// list table contents
tasks.push(function (callback) {
	var params = {
		TableName: table_name,
		Select: 'ALL_ATTRIBUTES'
	};
	dynamoDB.scan(params, function(error, data) {
		if (error)
			callback(error);
		else
			callback("scan");
	});
});

})();
