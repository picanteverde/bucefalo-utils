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
				if(fn && typeof(fn) === 'function'){
					if(value !== undefined){
						fn(value);
					}else{
						//in case the promise is succeeded with undefined?
						successFn.push(fn);
					}
				}
			},
			error: function(fn){
				if(fn && typeof(fn) === 'function'){
					if(error !== undefined){
						fn(error);
					}else{
						errorFn.push(fn);
					}
				}
			},
			then: function(succ, err){
				if((error === undefined) && (value === undefined)){
					if(err && typeof(err) === 'function'){
						errorFn.push(err);
					}
					if(succ && typeof(succ) === 'function'){
						successFn.push(succ);
					}
				}else{
					if(error !== undefined){
						err(error);
					}
					if(value !== undefined){
						succ(value);
					}
				}
			}
		};
	p.promise = function(){
		return {
			success: p.success,
			error: p.error,
			then: p.then
		};
	};
	p.onError = p.e = p.error;
	p.onSuccess = p.s = p.success;
	p.f = p.failed = p.fail;
	p.ok = p.succeeded;
	return p;
};