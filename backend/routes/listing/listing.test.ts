import {token, currentUserId} from "../Users/user.test.ts";
import supertest from "supertest";
import app from "../../server.ts";
import {describe, beforeAll, afterAll, test, expect} from "bun:test";
import {connectMongo, disconnectMongo} from "../../services/mongo.ts";
import chalk from "chalk";
import {StatusCodes} from "http-status-codes";

import {faker} from "@faker-js/faker"

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
    })
  })
})