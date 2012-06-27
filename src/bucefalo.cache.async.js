bucefalo.cache.async = function(db){
	var i = 0;
	return function(fn){
		var idx = i;
		i += 1;
		return function(x, cb){
			db.get(idx + ""+ x,function(err, value){
				if(err || (value === undefined)){
					fn(x, function(res){
						db.set(idx + "" + x, res, function(err){
							if(!err){
								cb(res);								
							}else{
								cb(err);
							}
						});
					});
				}else{
					cb(value);
				}
			});
		};
	};	
};
