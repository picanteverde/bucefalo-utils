bucefalo.monads.list = {
	bind: function(f){
		return function(list){
			var i = list.length,
				l = i,
				output = [];
			while(i--){
				output = output.concat(f(list[l - i -1]));
			}
			return output;
		};
	},
	unit: function(x){
		return [x];
	}
};