import supertest from "supertest";
import app from "../../server.ts";
import {describe, beforeAll, afterAll, test, expect} from "bun:test";
import {connectMongo, disconnectMongo} from "../../services/mongo.ts";
import chalk from "chalk";
import {StatusCodes} from "http-status-codes";
import {User} from "../../Types.ts";


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
  describe(`Test ${chalk.yellowBright("POST")} /api/user`, () => {
    const user: User = {
      email: "a@a.com", password: "87654321", username: "Ahmed54"
    }
    test("it Should Return 201 And Content-Type = Application/json", async () => {
      const response = await Client.post("/api/user/auth/sign-up").send(user).expect(201)
    })
    test("it Should Return 500 and Content-Type = Application/json ", async () => {
      const response = await Client.post("/api/user/auth/sign-up").send(user)
        .expect(500)
        .expect('Content-Type', /application\/json/)
      expect(response.body.success).toBe(false)
    })
  })
})


