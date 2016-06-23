var assert = require("assert");
var dbService = require("./mongoDB.js");

describe("Database", () => {
	describe("Get dataBase", () => {
		it("Got it", done =>{
			dbService.getDb()
			.then( db => {
				assert(db);
				done();
			});
		}); 
	});
});