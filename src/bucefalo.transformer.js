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