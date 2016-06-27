'use strict';

const userService = require("./userService");
const	assert = require("assert");

describe("Users data", () => {
	let users;
	before((done) => {
		userService.seedUser().then(userService.getUsers)
		.then(results => {
			users = results;
			done();
		});
	});
	
	it("User collection should never be empty since users are seeded", () => {
		assert(users.length > 0);
	});
	
	it("Users should have name", () => {
		assert(users[0].name);
	});
	
	it("Users should have lastName", () => {
		assert(users[0].lastName);
	});
	
	it("Users should have email", () => {
		assert(users[0].email);
	});
});


// describe("Users", function() {
//     describe("Get user",function() {
//       it("Got it", function(){
//          assert(true);
//       }); 
//     });
// });

//it.skip para salterse un testing
//it.only para ejecutar solo uno y debugiarlo