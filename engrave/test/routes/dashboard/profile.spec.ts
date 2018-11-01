import * as request from "supertest";
import { describe } from "mocha";
import { expect } from "chai";
import { server } from "../../../src/app";
import { TestUtils } from "../../TestUtils";

const agent = request(server);

describe("Dashboard: /profile", () => {

  describe("Unauthorized", () => {
    it("Should not render profile page", async () => {
      const result: any = await agent.get("/dashboard/profile");
      expect(result.statusCode).to.be.equal(401);
    });

    it("Should not post profile (unauthorized)", async () => {
      const result: any = await agent.post("/dashboard/profile").send({});
      expect(result.statusCode).to.be.equal(401);
    });
  });

  describe("Authorized", async () => {
    let cookie: string = null;

    before(async () => {
      cookie = await TestUtils.login('configured');
    });

    it("Should render profile page", async () => {
      const result: any = await agent
        .get("/dashboard/profile")
        .set("cookie", cookie);
      expect(result.statusCode).to.be.equal(200);
    });

    it("Should not post profile (name not provided)", async () => {
      const result: any = await agent
        .post("/dashboard/profile")
        .send({})
        .set("cookie", cookie)
        .expect(400);

      expect(result.body).to.be.equal("Name not provided");
    });

    it("Should not post profile (surname not provided)", async () => {
      const result: any = await agent
        .post("/dashboard/profile")
        .set("cookie", cookie)
        .send({ author_name: "test" })
        .expect(400);

      expect(result.body).to.be.equal("Surname not provided");
    });

    it("Should not post profile (bio not provided)", async () => {
      const result: any = await agent
        .post("/dashboard/profile")
        .set("cookie", cookie)
        .send({ author_name: "Test", author_surname: "Testing" })
        .expect(400);

      expect(result.body).to.be.equal("Bio not provided");
    });

    it("Should not post profile (image url not provided)", async () => {
      const result: any = await agent
        .post("/dashboard/profile")
        .set("cookie", cookie)
        .send({
          author_name: "Test",
          author_surname: "Testing",
          author_bio: "Testing test"
        })
        .expect(400);

      expect(result.body).to.be.equal("Image not provided");
    });

    it("Should post valid profile", async () => {
      const result: any = await agent
        .post("/dashboard/profile")
        .set("cookie", cookie)
        .send({
          author_name: "Test",
          author_surname: "Testing",
          author_bio: "Testing test",
          author_image_url: "Testing test"
        })
        .expect(200);
    });

    it("Should post empty profile", async () => {
      const result: any = await agent
        .post("/dashboard/profile")
        .set("cookie", cookie)
        .send({
          author_name: "",
          author_surname: "",
          author_bio: "",
          author_image_url: ""
        })
        .expect(200);
    });
  });

});
