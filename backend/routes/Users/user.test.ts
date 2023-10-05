import supertest from "supertest";
import app from "../../server.ts";
import {describe, beforeAll, afterAll, test, expect} from "bun:test";
import {connectMongo, disconnectMongo} from "../../services/mongo.ts";
import chalk from "chalk";
import {StatusCodes} from "http-status-codes";


const Client = supertest(app)

describe("Test Api User EndPoints", () => {
  beforeAll(() => {
    connectMongo()
  })
  afterAll(() => {
    disconnectMongo()
  })
  /**
   * Testing User Get endpoint
   * GET /api/user
   */
  describe(`Test ${chalk.greenBright("GET")} /api/user`, () => {
    test("It Should Return Response 200 And Content-Type = Application/json ", async () => {
      const response = await Client.get("/api/user")
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  })
})


