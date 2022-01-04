import app from "../index";
import request from "supertest";
const pg = require('pg')
const exec = require('child_process').exec;

// const { Pool } = require('pg');
// const dbTestParams = require('../../lib/db.ts');
// const db = new Pool(dbTestParams);

beforeAll(done => {
  done()
})

afterAll(done => {
  app.close()
  done()
})

describe("GET /jobs", () => {
  it("returns correct data", async () => {
    () => exec("npm run db:reset")
    let result = await request(app).get("/jobs").set('Content-Type', 'application/json')
    expect(JSON.parse(result.text)).toEqual(
      {"message":[{"id":1,"title":"Sous Chef","description":"Come work at the worlds finest restaurant!","location":"Toronto, ON","hourly_pay_rate":"30.00","created_at":'2022-01-04T17:46:56.849Z',"updated_at":'2022-01-04T17:46:56.849Z'},{"id":2,"title":"Customer Support Specialist","description":"Are you passionate about making our clients experience better? Come work for us!","location":"Guelph, ON","hourly_pay_rate":"24.99","created_at":'2022-01-04T17:46:56.849Z',"updated_at":'2022-01-04T17:46:56.849Z'}]}
    );
    expect(result.statusCode).toEqual(200);
  });
});

describe("GET /jobs/:id", () => {
  it("returns correct data", async () => {
    let result = await request(app).get("/jobs/1").set('Content-Type', 'application/json');
    expect(JSON.parse(result.text)).toEqual(
      {"message":[
        {"id":1,"title":"Sous Chef","description":"Come work at the worlds finest restaurant!","location":"Toronto, ON","hourly_pay_rate":"30.00","created_at":"2022-01-04T17:46:56.849Z","updated_at":"2022-01-04T17:46:56.849Z"}
      ]}
    )
    expect(result.statusCode).toEqual(200)
  });
});

describe("POST /jobs", () => {
  it("correctly adds data to database", async () => {
    let result = await request(app).post("/jobs").send({
      title: "Construction Worker",
      description: "We're looking for strong people to build things",
      location: "Toronto, ON",
      hourly_pay_rate: 40.00,
    }).set('Content-type', 'application/json').expect(200);

    expect(JSON.parse(result.text)).toEqual({ message: 'Job successfully created!' })
  })
})

describe("UPDATE /jobs", () => {
  it("correctly edits entry in database", async () => {
    let result = await request(app).put("/jobs/3").send({
      title: 'Lead Construction Worker'
    }).set('Content-type', 'application/json').expect(200);

    expect(JSON.parse(result.text)).toEqual({ message: 'Job successfully updated' })
  })
})

describe("DELETE /jobs/:id", () => {
  it('correctly deletes entries from the database', async () => {
    let result = await request(app).delete("/jobs/3").set('Content-Type', 'application/json');

    expect(JSON.parse(result.text)).toEqual({ message: 'Job successfully deleted' })
  })
})