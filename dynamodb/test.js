(function () {

	var dynamoDBConfiguration = {
		"accessKeyId": "foobar",
		"secretAccessKey": "foobar",
		"region": "us-east-1"
	};
	var AWS = require('aws-sdk');
	AWS.config.update(dynamoDBConfiguration);
	var databaseConfig = {"endpoint": new AWS.Endpoint("http://localhost:8000")};
	var dynamoDB = new AWS.DynamoDB(databaseConfig);
	var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
	Item: {
		idx: {
			N: '5'
		},
		item: {
			S: "mow the lawn"
		}
	},
	TableName: "todoTbl"
};
	console.log("\n----------------------------------------\n");

dynamoDB.putItem(params, function(err, data) {
	if (err) {
		console.error("Unable to update item. Error JSON:", err);
//		return {'error' : 'error in getLastIdx: ' + err };
	} else {
		console.log("UpdateItem succeeded:", data);
//		return data.Attributes.lastIdx;
	}
});


	// var params = {
	// 	TableName:"todoTbl",
	// 	Key:{
	// 		"idx": 0
	// 	},
	// 	UpdateExpression: "set lastIdx = lastIdx + :val",
	// 	ExpressionAttributeValues:{
	// 		":val":1
	// 	},
	// 	ReturnValues:"UPDATED_NEW"
	// };

	// console.log("\n----------------------------------------\n");
	// docClient.update(params, function(err, data) {
	// 	if (err) {
	// 		console.error("Unable to update item. Error JSON:", err);
	// 		return {'error' : 'error in getLastIdx: ' + err };
	// 	} else {
	// 		console.log("UpdateItem succeeded:", data);
	// 		return data.Attributes.lastIdx;
	// 	}
	// });

})();