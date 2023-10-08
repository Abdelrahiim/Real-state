import supertest from "supertest";
import app from "../../server.ts";
import {describe, beforeAll, afterAll, test, expect} from "bun:test";
import {connectMongo, disconnectMongo} from "../../services/mongo.ts";
import chalk from "chalk";
import {StatusCodes} from "http-status-codes";
import {User} from "../../Types.ts";
import {faker} from "@faker-js/faker"


const Client = supertest(app)

describe("Test Api User EndPoints", () => {
  beforeAll(() => {
    connectMongo()
  })
  afterAll(() => {
    disconnectMongo()
  })
  let token: string
  let currentUserId: string
  /**
   * Testing User Get endpoint
   * GET /api/user
   */
  describe.skip(`Test ${chalk.greenBright("GET")} /api/user/`, () => {
    test("It Should Return Response 200 And Content-Type = Application/json ", async () => {
      const response = await Client.get("/api/user")
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  })

  /**
   * Testing Authentication Endpoints
   * POST /api/user/auth
   */
  describe(`Test ${chalk.yellowBright("POST")} /api/user/auth`, () => {

    const user: User = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      username: faker.internet.userName()
    }
    const unCompleteUser = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const inValidUser = {
      email: faker.internet.email(),
      password: faker.internet.password()

    }

    /**
     * POST /api/user/auth/sign-up
     */
    describe("Test Sign Up Functionality", () => {
      test("it Should Return 201 And Content-Type = Application/json", async () => {
        const response = await Client.post("/api/user/auth/sign-up").send(user).expect(201)
      })
      test("it Should Return 400 and Error Message", async () => {
        const res = await Client.post("/api/user/auth/sign-up").send(unCompleteUser).expect(400)
        expect(res.body).toStrictEqual({error: "All Fields Are Mandatory"})
      })
      test("it Should Return 500 and Content-Type = Application/json ", async () => {
        const response = await Client.post("/api/user/auth/sign-up").send(user)
          .expect(500)
          .expect('Content-Type', /application\/json/)
        expect(response.body.success).toBe(false)
      })
    })
    /**
     * POST /api/user/auth/sign-in
     */
    describe("Test Sign In Functionality", () => {
      test("it Should Return 200 And Content-Type = Application/json", async () => {
        const response = await Client.post("/api/user/auth/sign-in").send({
          email: user.email,
          password: user.password
        }).expect(StatusCodes.OK)
        token = response.body.token
        currentUserId = response.body.user._id
      })
      test("it Should Return 403 and  Content-Type = Application/json and ", async () => {
        const response = await Client.post("/api/user/auth/sign-in").send(inValidUser).expect(StatusCodes.FORBIDDEN)
        expect(response.body.error).toBe("Invalid Credentials")
      })
    })
  })

  /**
   * Test Update User End Points
   * PUT api.user/update/userId
   */
  describe(`Test ${chalk.blueBright("PUT")} /api/user/auth/update/userId`, () => {
    test("it Should Return 202 And Content-Type = Application/json", async () => {
      const response = await Client.put(`/api/user/update/${currentUserId}`).send({
        username: faker.internet.userName()
      }).set("Cookie", [`_auth=${token}`]).expect(StatusCodes.ACCEPTED).expect('Content-Type', /application\/json/)
      expect(response.body._id).toBe(currentUserId)
    })
    test("it Should Return 401 And Content-Type = Application/json Error Message ", async () => {
      const response = await Client.put(`/api/user/update/${currentUserId}13223`).send({
        username: faker.internet.userName()
      }).set("Cookie", [`_auth=${token}`]).expect(StatusCodes.UNAUTHORIZED).expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe("You Can Only Update You Account")
    })
    test("it Should Return 401 And Content-Type = Application/json Error Message UnAuthorize ", async () => {
      const response = await Client.put(`/api/user/update/${currentUserId}`).send({
        username: faker.internet.userName()
      }).expect(StatusCodes.UNAUTHORIZED).expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe("UnAuthorized")
    })
  })


  /**
   * Test Update User End Points
   * DELETE api/user/delete/userId
   */
  describe(`Test ${chalk.redBright("DELETE")} /api/user/delete/userId`, () => {

    test("it Should Return 200", async () => {
      const response = await Client.del(`/api/user/delete/${currentUserId}`).send({
        username: faker.internet.userName()
      }).set("Cookie", [`_auth=${token}`]).expect(StatusCodes.OK)
    })

    test("it Should Return 401 And Content-Type = Application/json Error Message", async () => {
      const response = await Client.del(`/api/user/delete/${currentUserId}12343`).set("Cookie", [`_auth=${token}`]).expect(StatusCodes.UNAUTHORIZED)
      expect(response.body.error).toBe("You Can Only Update You Account")
    })

    test("it Should Return 401 Content-Type = Application/json Error Message UnAuthorize", async () => {
      const response = await Client.del(`/api/user/delete/${currentUserId}`).expect(StatusCodes.UNAUTHORIZED)
      expect(response.body.error).toBe("UnAuthorized")
    })
  })


})


