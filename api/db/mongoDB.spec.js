const assert = require("assert");
const dbService = require("./mongoDB.js");

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