var expect = require("chai").expect,
	bucefalo = require("../dist/bucefalo-utils.module.js");

describe ("Bucefalo Queues", function(){
	var createCounter = function(ms){
		var cnt = 0;
		return {
			add: function(cb){
				var that = this;
				cnt += 1;
				this.onChange(cnt);
				setTimeout(function() {
					that.sub();
					cb();
				}, ms);
			},
			sub: function(){
				cnt -= 1;
				this.onChange(cnt);
			},
			onChange: function(){

			}
		};
	},
	cnt;
	beforeEach(function(){
		cnt = createCounter(100);
	});

	it('should create a Queue with n paralel jobs',function(done){
		var n = 8,
			q = bucefalo.queues(n),
			i,
			len = 200;
		cnt.onChange = function(nJobs){
			if(nJobs > n){
				throw new Error("More than " + n + " Jobs");
			}
		};
		setTimeout(function(){
			done();
		}, 500);
		for(i = 0; i < len; i += 1){
			q.add(function(){
				cnt.add(function(){
					q.done();
				});
			});
		}
	});
});