var expect = require("chai").expect,
	bucefalo = require("../dist/bucefalo-utils.module.js");

describe ("Bucefalo Cache Async", function(){
	var fn, db;

	beforeEach(function(){
		var i = 0, 
			store = bucefalo.dictionary();
		fn = function (key, cb){
			i +=1;
			cb(i);
		};

		db ={
			set: function(key, value, cb){
				cb(null, store.add(key, value));
			},
			get: function(key, cb){
				cb(null, store.get(key));
			},
			del: function(key, cb){
				cb(null, store.remove(key));
			},
			store: store
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
		var cache = bucefalo.cache.async(db);
		fn = cache(fn);
		fn("one", function(res){
			expect(res).to.equal(1);
			fn("one", function(res){
				expect(res).to.equal(1);
				done();
			});
		});
	});

	it('should cache for different function', function(done){
		var cache = bucefalo.cache.async(db),
		fn1 = fn;
		fn = cache(fn);
		fn1 = cache(fn1);

		fn("one", function(res){
			expect(res).to.equal(1);
			fn("one", function(res){
				expect(res).to.equal(1);
				fn1("one", function(res){
					expect(res).to.equal(2);
					fn1("one", function(res){
						expect(res).to.equal(2);
						done();
					});
				});
			});
		});
	});
});