var expect = require("chai").expect,
	bucefalo = require("../dist/bucefalo-utils.module.js");

describe("Bucefalo Dictionary",function(){
	
	it("should save an element on a key", function(){
		var d = bucefalo.dictionary();
		expect(d.add("key1", "value1")).to.equal.true;
	});

	it("should retrieve an element", function(){
		var d = bucefalo.dictionary();
		d.add("key1", "value1");
		expect(d.get("key1")).to.equal("value1");
		d.add("key1", "value2");
		expect(d.get("key1")).to.equal("value2");
	});

	it("should remove an element", function(){
		var d = bucefalo.dictionary();
		d.add("key1", "value1");
		d.remove("key1");
		expect(d.get("key1")).to.equal.undefined;
	});

	it("should check for an element to exist", function(){
		var d = bucefalo.dictionary();
		d.add("key1", "value1");
		expect(d.exist("key1")).to.equal.true;
		expect(d.exist("key2")).to.equal.false;
		d.add("key3", "value3");
		d.remove("key3");
		expect(d.exist("key3")).to.equal.false;

	});

	it("should retrieve the index of a key", function(){
		var d = bucefalo.dictionary();
		d.add("key1", "value1");
		d.add("key2", "value2");
		d.add("key3", "value3");
		expect(d.indexOf("key2")).to.equal(1);
		expect(d.indexOf("key3")).to.equal(2);
		expect(d.indexOf("key1")).to.equal(0);

		d.remove("key2");

		expect(d.indexOf("key3")).to.equal(1);
	});

});