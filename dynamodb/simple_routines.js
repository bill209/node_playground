//nodejs dynamoDB routines
// requires aws-sdk

//dynamoDB_local instantiation
// requires async



	var dynDBConfig = {
	"accessKeyId": "DummyKeyForLocaldynamoDB",
	"secretAccessKey": "DummySecretAccessKeyForLocaldynamoDB",
	"region": "us-east-1"
	};

	// requiring aws-sdk, async
	var AWS = require('aws-sdk');
	var async = require('async');

	// For Local dynamoDB define endpoint will be "http://localhost:8000"
	var dbConfig = {"endpoint": new AWS.Endpoint("http://localhost:8000")};

	// provide your configurations
	AWS.config.update(dynDBConfig);
	// initialize dynamoDB Object.
	var dynamoDB = new AWS.dynamoDB(dbConfig);


/* work area */
scan();
/* --------- */


// create a table
function createTable(params){
	/*  params format
	var params = {
		TableName : "table_name",
		KeySchema: [
			{ AttributeName: "index_name", KeyType: "HASH" },  //Partition key
		],
		AttributeDefinitions: [
			{ AttributeName: "index_name", AttributeType: "N" }  //N = number
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 1, //Read/Writes per second
			WriteCapacityUnits: 1
		}
	};
	*/

	dynamoDB.createTable(params, function(err, data) {
		if (err)
			console.log(JSON.stringify(err, null, 2));
		else
			console.log(JSON.stringify(data, null, 2));
	});
}

// list tables
function listTables(){
	dynamoDB.listTables(function (err, data)
	{
	 console.log('listTables',err,data);
	});
}

// add single item to the table
var params = {
	TableName: 'todoTbl',
	Item: { // a map of attribute name to AttributeValue

		idx: 4,
		todoItem: "mop the floor"
	}
};
dynamoDB.put(params, function(err, data) {
	if (err) ppJson(err); // an error occurred
	else ppJson(data); // successful response
});

// add multiple items to a table
function batchWrite(items){
	/* items format
		items = {
			RequestItems: {
				"table_name": [ {
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
		if (err)
			console.log(JSON.stringify(err, null, 2));
		else
			console.log(JSON.stringify(data, null, 2));
	});

}

// delete table
function deleteTable (){
	var params = {
		TableName: 'table_name',
	};
	dynamoDB.deleteTable(params, function(err, data) {
		if (err)
		console.log(err);
		else
		console.log(data);
	});
}

// scan table - get all items from a table
function scan(){
	var params = {
		TableName: 'table_name',
		Select: 'ALL_ATTRIBUTES'
	};
	dynamoDB.scan(params, function(err, data) {
		if (err)
		console.log(err);
		else
		console.log(data);
	});
}

