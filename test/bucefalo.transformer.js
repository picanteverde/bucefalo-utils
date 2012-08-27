var expect = require("chai").expect,
	bucefalo = require("../dist/bucefalo-utils.module.js");


describe("Bucefalo Transformer", function(){
	it("should transform by paths",function(){
		var obj = {
				"field1":{
					"field1-1": "value1"
				},
				"field2": "value2"
			},
			t = bucefalo.transformer({
				"f1": "field1.field1-1",
				"f2": "field2"
			}),
			res = t(obj);

		expect(res.f1).to.equal(obj.field1["field1-1"]);
		expect(res.f2).to.equal(obj.field2);
	});

	it("should transform objects", function(){
		var obj = {
				"field1": {
					"field2": "value2",
					"field1-1": {
						"field1-1-1": "value1"
					}
				},
				"field3": "value3"
			},
			t = bucefalo.transformer({
				"f":{
					"f1": "field1.field1-1.field1-1-1",
					"f2": "field1.field2"
				},
				"f3": "field3"
			}),
			res = t(obj);

		expect(res.f.f1).to.equal(obj.field1["field1-1"]["field1-1-1"]);
		expect(res.f.f2).to.equal(obj.field1["field2"]);
		expect(res.f3).to.equal(obj.field3);
	});

	it("should transform an object from a query to an array", function(){
		var obj = {
				"field1": [
					{
						"arrf1": "value1",
						"arrf2": "value2"
					},
					{
						"arrf1": "value3",
						"arrf2": "value4"
					}
				],
				"field2": "value3"
			},
			t = bucefalo.transformer({
				"src": [
					"field1",
					{
						"select": "arrf2",
						"where":{
							"arrf1" : "value1"
						},
						"one": true
					}
				],
				"f2": "field2"
			}),
			res = t(obj);

		expect(res.src).to.equal("value2");
		expect(res.f2).to.equal("value3");
	});

	it("should return an array from a query to an array", function(){
		var obj = {
				"field1": [
					{
						"arrf1": "value1",
						"arrf2": "value2"
					},
					{
						"arrf1": "value3",
						"arrf2": "value4"
					}
				],
				"field2": "value3"
			},
			t = bucefalo.transformer({
				"src": [
					"field1",
					{
						"select": "arrf2",
					}
				],
				"f2": "field2"
			}),
			res = t(obj);

		expect(res.src.length).to.equal(2);
		expect(res.src[0]).to.equal("value2");
		expect(res.src[1]).to.equal("value4");
	});

	it("should transform and object from a query to an array and return objects", function(){
		var obj = {
				"field1": [
					{
						"arrf1": "value1",
						"arrf2": "value2"
					},
					{
						"arrf1": "value3",
						"arrf2": "value4"
					}
				],
				"field2": "value3"
			},
			t = bucefalo.transformer({
				"src": [
					"field1",
					{
						"select": {
							"f1": "arrf1",
							"f2": "arrf2"
						},
						"where":{
							"arrf1" : "value1"
						},
						"one": true
					}
				],
				"f2": "field2"
			}),
			res = t(obj);

		expect(res.src.f1).to.equal("value1");
		expect(res.src.f2).to.equal("value2");
	});

	it("should transform and object from a query to an array and return array", function(){
		var obj = {
				"field1": [
					{
						"arrf1": "value1",
						"arrf2": "value2"
					},
					{
						"arrf1": "value3",
						"arrf2": "value4"
					}
				],
				"field2": "value3"
			},
			t = bucefalo.transformer({
				"src": [
					"field1",
					{
						"select": {
							"f1": "arrf1",
							"f2": "arrf2"
						}
					}
				],
				"f2": "field2"
			}),
			res = t(obj);

		expect(res.src[0].f1).to.equal("value1");
		expect(res.src[0].f2).to.equal("value2");
		expect(res.src[1].f1).to.equal("value3");
		expect(res.src[1].f2).to.equal("value4");
	});
});