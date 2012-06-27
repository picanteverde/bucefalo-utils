var expect = require("chai").expect,
	bucefalo = require("../dist/bucefalo-utils.module.js");

describe ("Bucefalo Cache", function(){
	var fn;

	beforeEach(function(){
		var i = 0;
		fn = function (key, cb){
			i +=1;
			cb(i);
		};
	});

	it('should response different without cache',function(done){
		fn("one", function(res){
			expect(res).to.equal(1);
			fn("one", function(res){
				expect(res).to.equal(2);
				done();
			});
		});
	});

	it('should response the cached value', function(done){
		fn = bucefalo.cache(fn);
		fn("one", function(res){
			expect(res).to.equal(1);
			fn("one", function(res){
				expect(res).to.equal(1);
				done();
			});
		});
	});
});