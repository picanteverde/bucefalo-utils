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