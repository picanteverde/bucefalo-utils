bucefalo.promise = function(val){
	var successFn = [],
		errorFn = [],
		value = val,
		error,
		p = {
			succeed: function(val){
				var i = successFn.length;
				value = val;
				while(i--){
					successFn[i](val);
				}
			},
			fail: function(err){
				var i = errorFn.length;
				error = err;
				while(i--){
					errorFn[i](err);
				}	
			},
			success: function(fn){
				if(value !== undefined){
					fn(value);
				}else{
					//in case the promise is succeeded with undefined?
					successFn.push(fn);
				}
			},
			error: function(fn){
				if(error !== undefined){
					fn(error);
				}else{
					errorFn.push(fn);
				}
			},
			then: function(fn){
				if((error === undefined) && (value === undefined)){
					errorFn.push(fn);
					successFn.push(fn);
				}else{
					if(error !== undefined){
						fn(error);
					}
					if(value !== undefined){
						fn(value);
					}
				}
			}
		};
	p.onError = p.e = p.error;
	p.onSuccess = p.s = p.success;
	p.f = p.failed = p.fail;
	p.ok = p.succeeded;
	return p;
};