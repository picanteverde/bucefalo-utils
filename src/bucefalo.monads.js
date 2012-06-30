bucefalo.monads = {
	compose: function(f, g){
		return function(x){
			return g(f(x));
		};
	}
};