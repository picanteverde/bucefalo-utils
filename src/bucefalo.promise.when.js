bucefalo.promise.when = function(){
	var p = bucefalo.promise(),
		done = 0,
		i = arguments.length,
		len = i - 1,
		idx,
		fnx,
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
		idx = len - i;
		fnx = fn(idx);
		arguments[idx].then(fnx,fnx);
	}
	return p;
};