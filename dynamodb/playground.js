//nodejs dynamoDB routines
// requires aws-sdk

//dynamoDB_local instantiation
// requires async


	// requiring aws-sdk, async
	var AWS = require('aws-sdk');
	var async = require('async');
	
	var TABLENAME = 'newTable';
	var tasks=[];
	var dynDBConfig = {
	"accessKeyId": "DummyKeyForLocaldynamoDB",
	"secretAccessKey": "DummySecretAccessKeyForLocaldynamoDB",
	"region": "us-east-1",
	"endpoint": new AWS.Endpoint("http://localhost:8000")
	};

	// For Local dynamoDB define endpoint will be "http://localhost:8000"
//	var dbConfig = {"endpoint": new AWS.Endpoint("http://localhost:8000")};

	// provide your configurations
	AWS.config.update(dynDBConfig);
	// initialize dynamoDB Object.
	var db = new AWS.DynamoDB();
	var docClient = new AWS.DynamoDB.DocumentClient();

/* work area */
tasks.push(function(callback){ scan(callback);});
tasks.push(function(callback){ put(callback);});
tasks.push(function(callback){ scan(callback);});
// tasks.push(function(callback){ listTables(callback);});
// tasks.push(function(callback){ describeTable(callback);});


async.series(tasks,
	function(e,r){
		if(e){
			console.log('error: ',e);
		} else{
			for(var i=0;i<r.length;i++){
				console.log(i + ': ', r[i]);
			}
		}
	}
);

/* --------- */


// create a table
function createTable(callback){
	console.log('createTable');
	//params format
	var params = {
		TableName : 'newTable',
		KeySchema: [
			{ AttributeName: "index_name", KeyType: "HASH" },
		],
		AttributeDefinitions: [
			{ AttributeName: "index_name", AttributeType: "N" }
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 1,
			WriteCapacityUnits: 1
		}	
	};

	db.createTable(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}

// list tables
function listTables(callback){
	console.log('listTables');
	db.listTables(function (err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}


// delete table
function deleteTable (){
	var params = {
		TableName: TABLENAME,
	};
	db.deleteTable(params, function(err, data) {
		if (err) console.log(err);
		else console.log(data);

	});
}

// scan table - get all items from a table
function scan(callback){
	var params = {
		TableName: TABLENAME,
		Select: 'ALL_ATTRIBUTES'
	};
	db.scan(params, function(err, data) {
console.log('***** ',data.Items[1]);
		if (err) callback(err, data);
		else callback(null, data);
	});
}

// add single item to the table
function putItem(callback){
	var params = {
		TableName: TABLENAME,
		Item: { // a map of attribute name to AttributeValue
			index_name: { N: "2"},
			todoItem: { S: "shine a shoe"}
		}
	};
	db.putItem(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}

function describeTable(callback){
	var params = {
		TableName: TABLENAME,
	};
	db.describeTable(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}

// DOCCLIENT routines ------------------------------------------

// add single item to the table
function put(callback){
	var params = {
		TableName: TABLENAME,
		Item: {
			index_name: 21,
			todoItem: "nothing rhymes with twelve"
		}
	};
	docClient.put(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}

// add multiple items to a table
function batchWrite(items){
	/* items format
		items = {
			RequestItems: {
				TABLENAME: [ {
						PutRequest: {
							Item: {
								"idx": 1,
								"attribute_name": "value_to_add"
							}
						},...
					}
				]
			}
		};
	*/

	docClient.batchWrite(items, function (err, data) {
		if (err) console.log(err);
		else console.log(data);
	});

}

// update an item
function update(){
	var params = {
		TableName:"todoTbl",
		Key:{
			"idx": 0
		},
		UpdateExpression: "set lastIdx = :n",
		ExpressionAttributeValues:{
			":n":2
		},
		ReturnValues:"UPDATED_NEW"
	};

	docClient.update(params, function(err, data) {
			if (err) console.log(err);
			else console.log(data);
	});
}