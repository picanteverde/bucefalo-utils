bucefalo.promise.when = function(){
	var p = bucefalo.promise(),
		done = 0,
		len = arguments.length,
		i = len,
		idx,
		args = [],
		fn = function(idx){
			return function(){
				done += 1;
				args[idx] = arguments;
				if(done === len){
					p.succeed(args);
				}
			};
		};
	while(i--){
		idx = len -1 -i;
		arguments[idx].then(fn(idx));
	}
	return p;
};