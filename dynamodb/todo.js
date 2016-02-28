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
	AWS.config.update(dynDBConfig);
	// initialize DynamoDB Object.
	var dynamoDB = new AWS.DynamoDB(dbConfig);
	var docClient = new AWS.DynamoDB.DocumentClient();


addTodo().then(function(res){
	console.log('res: ', res);
});


// getTodos().then(function(res){
// 	console.log(res);

// 	for(i=0;i<res.Items.length;i++){
// 		console.log(i + ': ' + res.Items[i].todoItem.S);
// 	}
// });

function addTodo(){
	var deferred = Q.defer();
	
	var params = {
		TableName: 'todoTbl',
		Item: {	
				idx: 6,
				todoItem: "play the sticks"
		}
	};

	docClient.put(params, function(err, data) {
		if (err){
console.log('error: ', err);
			deferred.reject('error: ', err);
		} else {
			deferred.resolve(data);
		}		
	});
	return deferred.promise;
}


function addTodo2(){
	var deferred = Q.defer();

	var params = {
		TableName: 'todoTbl',
		Item: {	
				idx: 3,
				todoItem: "trim the tree"
		}
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
