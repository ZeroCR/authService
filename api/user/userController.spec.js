"use strict";

const assert = require("assert"),
  request = require("supertest"),
  app = require("../../app.js"), 
  agent = request.agent(app);

describe.skip("User Controller CRUD API", () => {
    
  it("Get Users", (done) => {
    agent.get("/api/s/users")
    .expect(200)
    .end( (err, results) => {
      if(err) throw (err);
      assert(results.body.length > 0);
      done();
    });
  });
  
  it("Get User by id", (done) => {
    agent.get("/api/s/users/555280a4750447453bacb952")
    .expect(200)
    .end( (err, results) => {
      if(err) throw (err);
      assert(results.body._id);
      done();
    });
  });
  
  it('Get user no exist', (done) => {
    agent.get("/api/s/users/554bea2beb203f4311202490")
    .expect(404)
    .end( (err, results) => {
      if(err) throw (err);
      assert(results.body.error !== null);
      done();
    });
  });
  
  it("Should allow a user to be posted and return an id");
});
