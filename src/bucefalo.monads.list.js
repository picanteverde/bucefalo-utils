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