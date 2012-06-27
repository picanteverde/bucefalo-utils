var expect = require("chai").expect,
	bucefalo = require("../dist/bucefalo-utils.module.js");

describe ("Bucefalo Promise", function(){
	
	it('should allow me to create a fullfiled promise',function(done){
		var p = bucefalo.promise("Success!");
		p.success(function(val){
			expect(val).to.equal("Success!");
			done();
		});
	});
	
	it('should allow me to fullfil a promise',function(done){
		var p = bucefalo.promise();
		p.success(function(val){
			expect(val).to.equal("Success!");
			done();
		});

		p.succeed("Success!");
	});

	it('should allow me to fail a promise',function(done){
		var p = bucefalo.promise();
		p.error(function(err){
			expect(err).to.equal("Error!");
			done();
		});

		p.fail("Error!");
	});

	it('should allow me to subscribe for success to a succedeed promise',function(done){
		var p = bucefalo.promise();
		p.success(function(val){
			expect(val).to.equal("Success!");
		});
		p.succeed("Success!");
		p.success(function(val){
			expect(val).to.equal("Success!");
			done();
		});
	});

	it('should allow me to subscribe for error to a failed promise',function(done){
		var p = bucefalo.promise();
		p.error(function(err){
			expect(err).to.equal("Error!");
		});
		p.fail("Error!");
		p.error(function(err){
			expect(err).to.equal("Error!");
			done();
		});
	});

	it('should allow me to subscribe a function if the promise succeed or fail',function(done){
		var p = bucefalo.promise(),
			p1 = bucefalo.promise();
		p.then(function(val){
			expect(val).to.equal("Error!");
		});
		p1.then(function(val){
			expect(val).to.equal("Success!");
			done();
		});
		p.fail("Error!");
		p1.succeed("Success!");

	});

});