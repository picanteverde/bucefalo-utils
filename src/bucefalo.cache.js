bucefalo.cache = function(fn){
	var cached = [],
		cache = {};
	return function(x, cb){
		var idx = cached.indexOf(x);
		if (idx === -1){
			fn(x,function(res){
				cached.push(x);
				cache[x] = res;
				cb(res);
			});
		}else{
			cb(cache[cached[idx]]);
		}
	};
};