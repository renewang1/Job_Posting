import app from "../index";
import request from "supertest";
import controller from '../controllers/jobs';
const { execSync } = require('child_process');

afterAll(() => {
  app.close((err) => {
    if (err) {
      console.log(err)
    }
    controller.close()
  })
})

beforeEach(() => {
  execSync('npm run db:reset')
})

describe("GET /jobs", () => {
  it("returns correct data", async () => {
    let result = await request(app).get("/jobs").set('Content-Type', 'application/json')
    expect(JSON.parse(result.text)).toEqual(
      {"message":[
        {"id":1,"title":"Sous Chef","description":"Come work at the worlds finest restaurant!","location":"Toronto, ON","hourly_pay_rate":"30.00","created_at":'2022-01-04T17:46:56.849Z',"updated_at":'2022-01-04T17:46:56.849Z'},
        {"id":2,"title":"Customer Support Specialist","description":"Are you passionate about making our clients experience better? Come work for us!","location":"Guelph, ON","hourly_pay_rate":"24.99","created_at":'2022-01-04T17:46:56.849Z',"updated_at":'2022-01-04T17:46:56.849Z'}
      ]}
    );
    expect(result.statusCode).toEqual(200);
  });
});

describe("GET /jobs/:id", () => {
  it("returns correct data for existing job posting", async () => {
    let result = await request(app).get("/jobs/1").set('Content-Type', 'application/json');
    expect(JSON.parse(result.text)).toEqual(
      {"message":[
        {"id":1,"title":"Sous Chef","description":"Come work at the worlds finest restaurant!","location":"Toronto, ON","hourly_pay_rate":"30.00","created_at":"2022-01-04T17:46:56.849Z","updated_at":"2022-01-04T17:46:56.849Z"}
      ]}
    )
    expect(result.statusCode).toEqual(200)
  });

  it("raises an error for nonexistent job posting", async () => {
    let result = await request(app).get("/jobs/100").set('Content-Type', 'application/json');
    expect(JSON.parse(result.text)).toEqual(
      { "message": 'Job not found' }
    )
    expect(result.statusCode).toEqual(404)
  })
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

  it("does not allow insufficient inputs", async () => {
    let result = await request(app).post("/jobs").send({
      description: "We're looking for strong people to build things",
      location: "Toronto, ON",
      hourly_pay_rate: 40.00,
    }).set('Content-type', 'application/json').expect(400);
  })

  it("does not allow bad data inputs", async () => {
    let result = await request(app).post("/jobs").send({
      title: null,
      description: "We're looking for strong people to build things",
      location: "Toronto, ON",
      hourly_pay_rate: 40.00,
    }).set('Content-type', 'application/json').expect(400);
  })
})

describe("UPDATE /jobs", () => {
  it("correctly edits entry in database", async () => {
    let result = await request(app).put("/jobs/2").send({
      title: 'Lead Construction Worker'
    }).set('Content-type', 'application/json').expect(200);

    expect(JSON.parse(result.text).message).toEqual('Job successfully updated' )
    expect(JSON.parse(result.text).data.title).toEqual('Lead Construction Worker')
  })

  it("ignores bad data types", async () => {
    let result = await request(app).put("/jobs/2").send({
      title: null
    }).set('Content-type', 'application/json').expect(200);

    expect(JSON.parse(result.text).data.title).toEqual('Customer Support Specialist')
  })

  it("does not allow editing undefined entries", async () => {
    let result = await request(app).put("/jobs/100").send({
      testing: 'test'
    }).set('Content-type', 'application/json').expect(400);

    expect(JSON.parse(result.text).message).toEqual('Could not update job')
  })
})

describe("DELETE /jobs/:id", () => {
  it('correctly deletes entries from the database', async () => {
    let result = await request(app).delete("/jobs/3").set('Content-Type', 'application/json');

    expect(JSON.parse(result.text)).toEqual({ message: 'Job successfully deleted' })
    expect(result.statusCode).toEqual(200)
  })
})