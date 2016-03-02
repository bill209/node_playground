// arn:aws:dynamodb:ddblocal:000000000000:table/todoTb

	var Q = require('q');

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
	AWS.config.update({accessKeyId: 'foo', secretAccessKey: 'barn'});
	AWS.config.update(dynDBConfig);
	// initialize DynamoDB Object.
	var dynamoDB = new AWS.DynamoDB(dbConfig);
	var docClient = new AWS.DynamoDB.DocumentClient();

console.log("\n\ngo\n");

console.log(getIdx());

// addTodo().then(function(res){
// 	console.log('res: ', res);
// });


// getTodos().then(function(res){
// 	console.log(res);

// 	for(i=0;i<res.Items.length;i++){
// 		console.log(i + ': ' + res.Items[i].item.S);
// 	}
// });

function addTodo(){
	var deferred = Q.defer();
	var uuid = guid();
	console.log('uuid: ', uuid);

	var params = {
		TableName: "todoTbl",
		Item: {
			idx: {
				N: uuid
			},
			item: {
				S: "play the sticks"
			}
		}
	};

	dynamoDB.putItem(params, function(err, data) {
		if (err){
console.log('error: ', err);
			deferred.reject('error: ', err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
}



function getTodos(){
	var deferred = Q.defer();

	var params = {
			TableName: 'todoTbl',
			Select: 'ALL_ATTRIBUTES'
	};

	dynamoDB.scan(params, function(err, data) {
			if (err){
				deferred.reject('error: ', err);
			} else {
				deferred.resolve(data);
			}
	});
	return deferred.promise;
}

function getIdx(callback){
	var params = {
		TableName: 'todoTbl',
		Key: { 
			idx: 0
		}
	};
	docClient.get(params, function(err, data) {
		callback(null, data.Item.lastIdx);
	});
}

function updateIdx(idx, callback){
	var params = {
		TableName: 'todoTbl',
		Item: {
			idx: 0,
			lastIdx: idx + 1 
		}
	};
	docClient.put(params, function(err, data) {
		cback(err, data);
	});
}

function getIdxAtomically(){
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

	console.log("Updating the item...");
	docClient.update(params, function(err, data) {
		if (err) {
			console.error("Unable to update item. Error JSON:", err);
			return {'error' : 'error in getLastIdx: ' + err };
		} else {
			console.log("UpdateItem succeeded:", data);
			return data.Attributes.lastIdx;
		}
	});
}

var tasks=[];
tasks.push(function(callback){ getIdx(callback);});
tasks.push(function(callback){ updateIdx(idx, callback);});

async.waterfall(tasks,
	function(e,r){
		if(e){
			console.log('e: ',e);
		} else{
			for(var i=0;i<r.length;i++){
				console.log(i + ': ', r[i]);
			}
		}
	}
);