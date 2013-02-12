bucefalo.queues = function(nMaxParallel){
	var queue = [],
		paralelCalls = 0;
	return {
		add: function(fn){
			if(paralelCalls < nMaxParallel){
				paralelCalls += 1;
				fn();
			}else{
				queue.push(fn);
			}
		},
		done: function(){
			var fn;
			if(queue.length){
				fn = queue.pop();
				fn();
			}else{
				paralelCalls -= 1;
			}
		}
	};	
};