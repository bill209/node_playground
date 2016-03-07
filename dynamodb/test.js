var Q = require('Q');


var main = function(){
	var deferred = Q.defer();
	var x = 'main :';

	func1(x)
		.then(function(y){
			func2(y)
			.then(function(z){
				deferred.resolve(z);
			})
		})

	return deferred.promise;
}



var func1 = function(x) {
	var deferred = Q.defer();
	Q.delay(200)
	 .done(function() {
		console.log("(resolving func1 promise)");
		deferred.resolve(x + ': func1 :');
	 });

	return deferred.promise;
}

var func2 = function(x) {
	var deferred = Q.defer();

	Q.delay(200)
	 .done(function() {
		console.log("(resolving func2 promise)");
		deferred.resolve(x + ': func2 :');
	 });

	return deferred.promise;
}

console.log('\n-----go-----\n');
main()
	.then(function(result){
		console.log('result: ',result);
	})
