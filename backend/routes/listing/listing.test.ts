import {token, currentUserId} from "../Users/user.test.ts";
import supertest from "supertest";
import app from "../../server.ts";
import {describe, afterAll, test, expect} from "bun:test";
import {disconnectMongo} from "../../services/mongo.ts";
import chalk from "chalk";
import {StatusCodes} from "http-status-codes";

import {faker} from "@faker-js/faker"

let listingId: string
const Client = supertest(app)
describe("Testing List EndPoints", () => {
  afterAll(() => {
    disconnectMongo()
  })

  /**
   * Test Create Listing EndPoints
   * POST /api/listing
   */
  describe(`Test ${chalk.yellowBright("POST")} /api/listing/`, () => {
    const listing = {
      address: faker.location.streetAddress(),
      bathrooms: faker.number.int({min: 1, max: 5}),
      bedrooms: faker.number.int({min: 1, max: 15}),
      description: faker.commerce.productDescription(),
      discountPrice: Number(faker.commerce.price()),
      furnished: true,
      imageURL: [faker.internet.avatar(), faker.internet.avatar()],
      offer: true,
      parking: true,
      regularPrice: Number(faker.commerce.price()),
      type: faker.commerce.department(),
      name: faker.commerce.productName()
    }
    test("It Should Return Response 201 And Content-Type = Application/json ", async () => {
      const response = await Client.post("/api/listing").send(
        listing
      ).set("Cookie", [`_auth=${token}`])
        .expect(StatusCodes.OK)
        .expect('Content-Type', /application\/json/)
      listingId = response.body._id
    })
  })

  /**
   * It Returns Only Listing That The Register User Created
   * Test Get Listing EndPoints
   * GET /api/listing
   */
  describe(`Test ${chalk.greenBright("GET")} /api/listing/`, () => {
    test("It Should Return Response 201 And Content-Type = Application/json", async () => {
      const response = await Client.get("/api/listing")
        .set("Cookie", [`_auth=${token}`])
        .expect(StatusCodes.OK)
        .expect('Content-Type', /application\/json/)
    })
    test("It Should Return Response 401 And Content-Type = Application/json", async () => {
      const response = await Client.get("/api/listing")
        .expect(StatusCodes.UNAUTHORIZED)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe("UnAuthorized")
    })

  })

  /**
   * Test DELETE Listing EngPoints
   * DELETE /api/listing/id
   */
  describe(`Test ${chalk.redBright("DELETE")} api/listing/:id`, () => {
    test("It Should Return Response 200", async () => {
      const response = await Client.del(`/api/listing/${listingId}`)
        .set("Cookie", [`_auth=${token}`])
        .expect(StatusCodes.OK)
    })
    test("It Should Return Response 401 And Content-Type = Application/json", async () => {
      const response = await Client.del(`/api/listing/${listingId}`)
        .expect(StatusCodes.UNAUTHORIZED)
        .expect('Content-Type', /application\/json/)
      expect(response.body.error).toBe("UnAuthorized")
    })

    test("It Should Return 404 NOT FOUND ", async () => {
      const response = await Client.del(`/api/listing/324`)
        .set("Cookie", [`_auth=${token}`]).expect(StatusCodes.NOT_FOUND)
    })
  })


})