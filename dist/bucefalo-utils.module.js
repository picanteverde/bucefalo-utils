/*! Bucefalo Utils - v0.1.0 - 2012-07-11
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
module.exports = bucefalo;