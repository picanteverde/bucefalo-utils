var expect = require("chai").expect,	
	bucefalo = require("../dist/bucefalo-utils.module.js");

describe ("Bucefalo Monads Promise", function(){
	var mock ={
		//readFile :: String -> Promise String
		readFile: function(path){
			var promiseString = bucefalo.promise();
			setTimeout(function(){
				promiseString.succeed('{"name": "bucefalo", "url":"https://github.com/picanteverde/bucefalo-utils"}');
			}, 100);
			return promiseString;
		},
		//JSONparse :: String -> Promise Object
		JSONparse: function(json){
			var promiseObject = bucefalo.promise();
			setTimeout(function(){
				promiseObject.succeed(JSON.parse(json));
			},100);
			return promiseObject;
		},
		//getUrl :: Object -> Promise String
		getUrl: function(obj){
			var promiseString = bucefalo.promise();
			setTimeout(function(){
				promiseString.succeed(obj.url);
			},100);
			return promiseString;
		},
		//getRepo :: String -> Promise String
		getRepo: function(url){
			var promiseString = bucefalo.promise();
			setTimeout(function(){
				promiseString.succeed(url.split("/")[4]);
			}, 100);
			return promiseString;
		}
	};

	it("should allow me to pipe functions", function(done){
		bucefalo.monads.promise.pipe([mock.readFile, mock.JSONparse, mock.getUrl, mock.getRepo])("path/").success(function(repo){
			expect(repo).to.equal("bucefalo-utils");
			done();
		});
	});
});