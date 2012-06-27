var expect = require("chai").expect,
	bucefalo = require("../dist/bucefalo-utils.module.js");

describe ("Bucefalo Promise When", function(){
	it('should allow me to subscribe a function when two promisess are done',function(done){
		var p1 = bucefalo.promise(),
		p2 = bucefalo.promise();

		bucefalo.promise.when(p1, p2).then(function(args){
			expect(args.length).to.equal(2);
			expect(args[0][0]).to.equal("Success1!");
			expect(args[1][0]).to.equal("Success2!");
			done();
		});

		p1.succeed("Success1!");
		p2.succeed("Success2!");
	});
});