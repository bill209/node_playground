var Q = require('Q');
var DJ = require('./dadJokeSvc.js');




function getRandomDadJoke() {
	var deferred = Q.defer();

	Q.delay(1000)
	 .done(function() {
		console.log("(resolving the promise)");
		deferred.resolve('success');
	 });
	return deferred.promise;
}

DJ.getRandomDadJoke()
.then(function(d){
	console.log('BOOM: ',d);
})
