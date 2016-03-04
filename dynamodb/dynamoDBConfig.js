
var AWS = require('aws-sdk');
var dynDBConfig = {
	"accessKeyId": "DummyKeyForLocaldynamoDB",
	"secretAccessKey": "DummySecretAccessKeyForLocaldynamoDB",
	"region": "us-east-1",
	"endpoint": new AWS.Endpoint("http://localhost:8000")
};

AWS.config.update(dynDBConfig);

exports.db = new AWS.DynamoDB();
exports.dc = new AWS.DynamoDB.DocumentClient();
