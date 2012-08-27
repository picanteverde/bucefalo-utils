/*! Bucefalo Utils - v0.1.0 - 2012-08-27
* https://github.com/picanteverde/bucefalo-utils
*/

var bucefalo = {};
bucefalo.dict = bucefalo.dictionary = function(){
	var elements = [],
		mappers = {};
	return {
		add: function(key, value){
			if(elements.indexOf(key) === -1){
				elements.push(key);
			}
			mappers[key] = value;
			return true;
		},
		get: function(key){
			return mappers[key];
		},
		remove: function(key){
			var idx = elements.indexOf(key);
			if(idx !== -1){
				elements.splice(idx,1);
				mappers[key] = null;
				delete mappers[key];
			}
			return true;
		},
		exist: function(key){
			return (elements.indexOf(key) !== -1);
		},
		indexOf: function(key){
			return elements.indexOf(key);
		},
		elements: elements,
		mappers: mappers
	};
};
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
				if(done === (len + 1)){
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

bucefalo.monads = {
	compose: function(f, g){
		return function(x){
			return g(f(x));
		};
	},
	pipe: function(fns){
		var l = fns.length - 1;
		return function (x){
			var i = fns.length;
			while(i--){
				x = fns[l - i](x);
			}
			return x;
		};
	},
	pipex: function(x, fns){
		var i = fns.length,
			l = i - 1;
		while(i--){
			x = fns[l - i](x);
		}
		return x;
	},
	bindfns: function(fns, bind){
		var i = fns.length;
		while(i--){
			fns[i] = bind(fns[i]);
		}
		return fns;
	},
	pipebindunit: function(fns, bind, unit){
		return this.compose(unit, this.pipe(this.bindfns(fns, bind)));
	}
};
bucefalo.monads.list = {
	bind: function(f){
		return function(list){
			var i = list.length,
				l = i - 1,
				output = [];
			while(i--){
				output = output.concat(f(list[l - i]));
			}
			return output;
		};
	},
	bindx: function(list, f){
		var i = list.length,
			l = i - 1,
			output = [];
			while(i--){
				output = output.concat(f(list[l - i]));
			}
		return output;
	},
	unit: function(x){
		return [x];
	},
	pipe: function(fns){
		return bucefalo.monads.pipebindunit(fns, this.bind, this.unit);
	}
};
bucefalo.monads.promise = {
	bind: function(f){
		return function(input){
			var output = bucefalo.promise();
			input.then(function(x){
				f(x).then(function(y){
					output.succeed(y);
				});
			});
			return output;
		};
	},
	unit: function(x){
		return bucefalo.promise(x);
	},
	pipe: function(fns){
		return bucefalo.monads.pipebindunit(fns, this.bind, this.unit);
	}
};
bucefalo.transformer = function(definition){
	 var getPath = function(obj, path){
			var res = obj, 
				key, 
				arr = path.split("."),
				l = arr.length,
				i;
			for(i = 0; i < l; i += 1){
				if(res !== undefined){
					res = res[arr[i]];
				}
			}
			return res;

		},
		solveWhere = function(data, where){
			var i, len, res, key, valid;
			if(where){
				res = [];
				len = data.length;
				for (i = 0; i < len; i += 1){
					valid = true;
					for(key in where){
						if(getPath(data[i],key) !== where[key]){
							valid = false;
						}
					}
					if(valid){
						res.push(data[i]);
					}
				}
				return res;
			}else{
				return data;
			}
		},
		solveSelect = function(data, select){
			var res, i, len;
			if(select && data){
				res = [];
				switch(typeof(select)){
					case "object":
							len = data.length;
							for(i = 0 ;i < len; i += 1){
								res.push(process(select, data[i]));
							}
						break;
					case "string":
						len = data.length;
						for(i = 0 ;i < len; i += 1){
							res.push(getPath(data[i], select));
						}
						break;
				}
				return res;
			}else{
				return data;
			}
		},
		process = function(def, data){
			var key, 
				query,
				arr,
				res = {};

			for(key in def){
				switch(typeof(def[key])){
					case "string":
						res[key] = getPath(data, def[key]);
						break;
					case "object":
						if(Array.isArray(def[key])){ //query to an Array
							query = def[key];
							arr = getPath(data, query[0]);
							arr = solveWhere(arr,query[1].where);
							arr = solveSelect(arr, query[1].select);
							if (arr && query[1].one){
								res[key] = arr[0];
							}else{
								res[key] = arr;
							}
						}else{ //object
							res[key] = process(def[key], data);
						}
						break;

				}
			}
			return res;	
		};

	return function(obj){
		return process(definition, obj);
	};
};
module.exports = bucefalo;