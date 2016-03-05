
var CFG = require('./dynamoDBConfig.js');
var async = require('async');
// var ppJson = require('ppjson');

var TABLENAME = 'dadJokes';
var tasks=[];

/* work area */
//tasks.push(function(callback){ scan(callback);});
//tasks.push(function(callback){ updateAtomically(callback);});
tasks.push(function(callback){ scan(callback);});
// tasks.push(function(callback){ listTables(callback);});
// tasks.push(function(callback){ describeTable(callback);});


async.series(tasks,
	function(e,r){
		if(e){
			console.log('error: ',e);
		} else{
			console.log(JSON.stringify(r,null,2));
		}
	}
);

/* --------- */

// --------------------------------------------------- create a table
function createTable(callback){
	//params format
	var params = {
		TableName : TABLENAME,
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

	CFG.db.createTable(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}

// --------------------------------------------------- list tables
function listTables(callback){
	console.log('listTables');
	CFG.db.listTables(function (err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}


// --------------------------------------------------- delete table
function deleteTable (){
	var params = {
		TableName: TABLENAME,
	};
	CFG.db.deleteTable(params, function(err, data) {
		if (err) console.log(err);
		else console.log(data);

	});
}

// --------------------------------------------------- scan table - get all items from a table
function scan(callback){
	var params = {
		TableName: TABLENAME,
		Select: 'ALL_ATTRIBUTES'
	};
	CFG.db.scan(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}

// --------------------------------------------------- add single item to the table
function putItem(callback){
	var params = {
		TableName: TABLENAME,
		Item: { // a map of attribute name to AttributeValue
			index_name: { N: "2"},
			todoItem: { S: "shine a shoe"}
		}
	};
	CFG.db.putItem(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}

function describeTable(callback){
	var params = {
		TableName: TABLENAME,
	};
	CFG.db.describeTable(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}

// --------------------------
// docClient routines
// --------------------------

// --------------------------------------------------- add single item to the table
function put(callback){
	var params = {
		TableName: TABLENAME,
		Item: {
			idx: 0,
			lastIdx: 2
		}
	};
	CFG.dc.put(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}

// --------------------------------------------------- add multiple items to a table
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

	CFG.dc.batchWrite(items, function (err, data) {
		if (err) console.log(err);
		else console.log(data);
	});

}

// --------------------------------------------------- update an item
function update(callback){
	var params = {
		TableName: TABLENAME,
		Key:{
			"idx": 0
		},
		UpdateExpression: "set lastIdx = :n",
		ExpressionAttributeValues:{
			":n":4
		},
		ReturnValues:"UPDATED_NEW"
	};

	CFG.dc.update(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);	});
}

function updateAtomically(callback){
	var params = {
		TableName:"todoTbl",
		Key:{
			"idx": 0
		},
		UpdateExpression: "set lastIdx = lastIdx + :val",
		ExpressionAttributeValues:{
			":val":1
		},
		ReturnValues:"UPDATED_NEW"
	};

	CFG.dc.update(params, function(err, data) {
		if (err) callback(err, data);
		else callback(null, data);
	});
}
