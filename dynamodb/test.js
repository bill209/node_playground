var Q = require('Q');


var grdj = function(){
	var deferred = Q.defer();
	var x = 'start:';

	getItemCount(x)
		.then(function(y){
			getDadJoke(y)
			.then(function(z){
				deferred.resolve(z);
			})
		})

	return deferred.promise;
}



var getItemCount = function(x) {
	var deferred = Q.defer();
	Q.delay(200)
	 .done(function() {
		console.log("(resolving getItemCount promise)");
		deferred.resolve(x + ':getItemCount:');
	 });

	return deferred.promise;
}

var getDadJoke = function(x) {
	var deferred = Q.defer();

	Q.delay(200)
	 .done(function() {
		console.log("(resolving getDadJoke promise)");
		deferred.resolve(x + ':getDadJoke:');
	 });

	return deferred.promise;
}

console.log('\n-----go-----\n');
grdj()
	.then(function(result){
		console.log('result: ',result);
	})
