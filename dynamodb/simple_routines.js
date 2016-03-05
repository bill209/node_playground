var CFG = require('./dynamoDBConfig.js');

var TABLENAME = 'dadJokes';

/* work area */
console.log('\n------------------');
get();
console.log('\n------------------');
/* --------- */


// ---------------------------------------------- createTable
function createTable(){
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
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));
	});
}

// ---------------------------------------------- listTables
function listTables(){
	CFG.db.listTables(function (err, data)
	{
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));
	});
}

// ---------------------------------------------- deleteTable
function deleteTable (){
	var params = {
		TableName: TABLENAME,
	};
	CFG.db.deleteTable(params, function(err, data) {
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));

	});
}

// ---------------------------------------------- describeTable
function describeTable (){
	var params = {
		TableName: TABLENAME,
	};
	CFG.db.describeTable(params, function(err, data) {
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));

	});
}

// ---------------------------------------------- scan
function scan(){
	var params = {
		TableName: TABLENAME,
		Select: 'ALL_ATTRIBUTES'
	};
	CFG.db.scan(params, function(err, data) {
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));

	});
}

// --------------------------
// docClient routines
// --------------------------

// ---------------------------------------------- get
function get(){
	var params = {
		TableName: TABLENAME,
		Key: {
			idx: 4
		}
	};
	CFG.dc.get(params, function(err, data) {
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));
	});
}

// ---------------------------------------------- put
function put(){
	var params = {
		TableName: TABLENAME,
		Item: {
			index_name: 1,
			todoItem: "mop the floor"
		}
	};
	CFG.dc.put(params, function(err, data) {
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));
	});
}

// ---------------------------------------------- update
function update(){
	var params = {
		TableName:TABLENAME,
		Key:{
			index_name: 1,
		},
		UpdateExpression: "set todoItem = :n",
		ExpressionAttributeValues:{
			":n":"bake a pie"
		},
		ReturnValues:"UPDATED_NEW"
	};

	CFG.dc.update(params, function(err, data) {
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));
	});
}

// ---------------------------------------------- batchWrite
function batchWrite(items){
	var params = {
		RequestItems: {
			todoTbl: [
				{
					PutRequest: {
						Item: {
							idx: 11,
							todoItem: '*** hate eight'
						}
					}
				},
				{
					DeleteRequest: {
						Key: {
							idx: 1
						}
					}
				}
			]
		}
	};
	CFG.dc.batchWrite(params, function(err, data) {
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));
	});
}

function updateAtomically(){
	var params = {
		TableName: TABLENAME,
		Key:{
			idx: 0
		},
		UpdateExpression: "set lastIdx = lastIdx + :val",
		ExpressionAttributeValues:{
			":val":1
		},
		ReturnValues:"UPDATED_NEW"
	};

	CFG.dc.update(params, function(err, data) {
		if (err) console.log(JSON.stringify(err,null,2));
		else console.log(JSON.stringify(data,null,2));
	});
}