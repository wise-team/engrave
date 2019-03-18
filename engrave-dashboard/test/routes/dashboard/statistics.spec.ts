import { TestUtils } from './../../TestUtils';
import * as request from "supertest";
import { describe } from "mocha";
import { expect } from "chai";
import { server } from "../../../src/app";

const agent = request(server);

describe("Dashboard: /statistics", () => {

    describe("Unauthorized", () => {
        it("Should not render statistics page", async () => {
            const result: any = await agent.get("/dashboard/statistics");
            expect(result.statusCode).to.be.equal(401);
        });

        it("Should not update statistics settings", async () => {
          const result: any = await agent
            .put("/dashboard/statistics")
            .send({ 
                analytics_gtag: 'UA-123123-1',
                webmastertools_id: 'asdadsdsa'
            });

          expect(result.statusCode).to.be.equal(401);
        });

        it("Should not get statistics data", async () => {
          const result: any = await agent
            .post("/dashboard/statistics")
            .send({});

          expect(result.statusCode).to.be.equal(401);
        });
    });

    describe("Authorized", async () => {
        let cookie: string = null;

        beforeEach(async () => {
            await TestUtils.prepare();
            cookie = await TestUtils.login('configured');
        });

        it("Should render profile page", async () => {
            const result: any = await agent
              .get("/dashboard/statistics")
              .set("cookie", cookie);
            expect(result.statusCode).to.be.equal(200);
        });

        it("Should update statistics settings", async () => {
            const result: any = await agent
                .put("/dashboard/statistics")
                .send({
                    analytics_gtag: 'UA-123123-1',
                    webmastertools_id: 'xxxxxxxxxxxxxxx'
                })
                .set("cookie", cookie)
                .expect(200);
                
            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("success");
            expect(result.body.success).to.be.equal("Settings saved successfully");
        });

        it("Should not update empty statistics settings", async () => {
            const result: any = await agent
                .put("/dashboard/statistics")
                .send({})
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Tracking ID not provided");
        });

        it("Should not update statistics settings (Tracking ID not provided)", async () => {
            const result: any = await agent
                .put("/dashboard/statistics")
                .send({ webmastertools_id: 'xxxxxxxxxxxxxxx'})
                .set("cookie", cookie)
                .expect(400);
            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Tracking ID not provided");
        });

        it("Should not update statistics settings (Verification ID not provided)", async () => {
            const result: any = await agent
              .put("/dashboard/statistics")
              .send({ analytics_gtag: "UA-123123-1" })
              .set("cookie", cookie)
              .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Verification ID not provided");
        });

        it("Should get statistics data", async () => {
            const result: any = await agent
              .post("/dashboard/statistics")
              .send({})
              .set("cookie", cookie)
              .expect(200);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a('object');
            expect(result.body).to.have.property("statistics");
            expect(result.body.statistics).to.be.a("array");
        });

    });

});
