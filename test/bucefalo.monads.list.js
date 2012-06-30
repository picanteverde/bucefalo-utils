var expect = require("chai").expect,
	bucefalo = require("../dist/bucefalo-utils.module.js");

describe ("Bucefalo Monads List", function(){
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

});