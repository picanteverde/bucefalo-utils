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

	it("should allow me to pipe functions", function(){
		var fn0 = function (n){
				return [n-10, n+10];
			},
			fn1 = function (n){
				return [n -5, n+5];
			},
			fn2 = function (n){
				return [n -2, n+2];
			},
			arr = bucefalo.monads.list.pipe([fn0,fn1,fn2])(0);
			expect(arr[0]).to.equal(-17);
			expect(arr[1]).to.equal(-13);
			expect(arr[2]).to.equal(-7);
			expect(arr[3]).to.equal(-3);
			expect(arr[4]).to.equal(3);
			expect(arr[5]).to.equal(7);
			expect(arr[6]).to.equal(13);
			expect(arr[7]).to.equal(17);
	});




});