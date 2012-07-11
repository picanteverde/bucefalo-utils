Bucefalo Utils
=============

Bucefalo Utilities for JavaScript.


Utilities
--------


* Dictionary: Fast Dictionary implementation using native functions
* Promise: Fast Promises with just the method needed 
* Cache: Cacheable function creator
* Async Cache: Cacheable function creator with an asynchronous store
* Monads: Collection of usefull monads


How to use
------------

### Dictionary 
Some times you need a dictionary structure like any object in javascript but with out the need to loop it without the annoyning hasOwnProperty check inside,
and even better with the speed of the indexOf native implemented in the array
	var d = bucefalo.dictionary();
	d.add("key1", "value1");
	d.add("key2", "value2");
	d.add("key3", "value3");
	d.indexOf("key2");
	d.indexOf("key3");
	d.indexOf("key1");
### Promise
### Cache
### Async Cache


Monads
------
Monads is a design patter for functions that receives monadic values.


### List Monads
	var convert = [
		"zero",
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine"
		],
		fn1 = function(n){
			return [n+1, n+2, n+3];
		},
		fn2 = function(n){
			return convert[n].split("");
		};

	it('should allow me to compose list functions',function(){
		var fn = bucefalo.monads.compose(bucefalo.monads.list.bind(fn1), bucefalo.monads.list.bind(fn2));
		var ret = fn(bucefalo.monads.list.unit(0));
		expect(ret[0]).to.equal("o");
		expect(ret[1]).to.equal("n");
		expect(ret[2]).to.equal("e");
		expect(ret[3]).to.equal("t");
		expect(ret[4]).to.equal("w");
		expect(ret[5]).to.equal("o");
	});

### Promise Monads

var mock ={
		//readFile :: String -> Promise String
		readFile: function(path){
			var promiseString = bucefalo.promise();
			setTimeout(function(){
				promiseString.succeed('{"name": "bucefalo", "url":"https://github.com/picanteverde/bucefalo-utils"}');
			}, 100);
			return promiseString;
		},
		//JSONparse :: String -> Promise Object
		JSONparse: function(json){
			var promiseObject = bucefalo.promise();
			setTimeout(function(){
				promiseObject.succeed(JSON.parse(json));
			},100);
			return promiseObject;
		},
		//getUrl :: Object -> Promise String
		getUrl: function(obj){
			var promiseString = bucefalo.promise();
			setTimeout(function(){
				promiseString.succeed(obj.url);
			},100);
			return promiseString;
		},
		//getRepo :: String -> Promise String
		getRepo: function(url){
			var promiseString = bucefalo.promise();
			setTimeout(function(){
				promiseString.succeed(url.split("/")[4]);
			}, 100);
			return promiseString;
		}
	};

	it("should allow me to pipe functions", function(done){
		bucefalo.monads.promise.pipe([mock.readFile, mock.JSONparse, mock.getUrl, mock.getRepo])("path/").success(function(repo){
			expect(repo).to.equal("bucefalo-utils");
			done();
		});
	});
