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
