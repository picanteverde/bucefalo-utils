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