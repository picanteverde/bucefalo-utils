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