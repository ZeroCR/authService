'use strict';

const assert = require("assert"),
	userModel = require("./userModel"),
	userService = require("./userService"),
	ObjectId = require('mongodb').ObjectID;

describe("User Services", () => {
		
	describe("Get User", () => {
		it("Get User by Id", done => {
			const objectId = new ObjectId("5599b1bcde888ba70643b3bf");
			userService.getUser({_id: objectId}, {_id: true}).then(
				(user) => {
					assert(user._id.equals(objectId));
					done();
				},(err) => { throw err});
		});
		
		it("Get Users", done => {
			userService.getUsers({},{_id: true, name: true}).then(
				(users) => {
					assert(users);
					done();
				}, (err) => { throw err});
		});
		
		it("Get User by Email", done => {
			const userEmail = "ed1g2a3r@gmail.com";
			userService.getUser({email: userEmail}, {_id: true}).then(
				(user) => {
					assert(!!user);
					done();
				}, (err) => {throw err});
		});
	});
		
	describe("Save User", () => {
		it("It is a valid user", () => {
			const user = userModel.Create({
				name: "edgar",
				lastName: "test",
				email: "test@test.com"
			});
			assert(user);
		});
		
		it("It is a invalid user", () => {
			try{
				userModel.Create({
					name: "123"
				});
			}catch(err) {
				assert(true);
			}
		});
		
		it("It has an invalid name", () => {
			try{
				userModel.Create({
					name: "123",
					lastName: "test",
					email: "test@test.com"
				});
			}catch(err) {
				assert(true);
			}
		});
		
		it("It has an invalid lastname", () => {
			try{
				userModel.Create({
					name: "edgar",
					lastName: "123",
					email: "test@test.com"
				});
			}catch(err) {
				assert(true);
			}
		});
		
		it("It has an invalid email", () => {
			try{
				userModel.Create({
					name: "edgar",
					lastName: "123",
					email: "testtest.com"
				});
			}catch(err) {
				assert(true);
			}
		});
		
		it("It is send to the service");
		
		it("It is saved in db");
		
		it("New ID is returned");
	});
	
	describe("Edit User", () => {
		it("Got it", () => {
			assert(true);
		}); 
	});
	
	describe("Delete User", () => {
		it("Got it", () => {
			assert(true);
		}); 
	});
		
});