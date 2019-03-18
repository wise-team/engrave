import * as request from "supertest";
import { describe, should } from "mocha";
import { expect } from "chai";
import { server } from "../../../src/app";
import { TestUtils } from "../../TestUtils";

const agent = request(server);

describe("Dashboard: /themes", () => {

    describe("Unauthorized", () => {
        it("Should not render themes page", async () => {
            const result: any = await agent.get("/dashboard/themes");
            expect(result.statusCode).to.be.equal(401);
        });

        it("Should not change theme (unauthorized)", async () => {
            const result: any = await agent.post("/dashboard/themes").send({ theme: 'clean-blog' });
            expect(result.statusCode).to.be.equal(401);
        });
    });

    describe("Authorized", async () => {
        let cookie: string = null;

        before(async () => {
            cookie = await TestUtils.login('configured');
        });

        it("Should render themes page", async () => {
            const result: any = await agent
                .get("/dashboard/themes")
                .set("cookie", cookie);

            expect(result.statusCode).to.be.equal(200);
        });

        it("Should not change theme (theme not provided)", async () => {
            const result: any = await agent
                .post("/dashboard/themes")
                .send({})
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Theme not provided");
        });

        it("Should not change with empty theme", async () => {
            const result: any = await agent
                .post("/dashboard/themes")
                .send({ theme: '' })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Invalid theme");
        });

        it("Should not change with invalid theme", async () => {
            const result: any = await agent
                .post("/dashboard/themes")
                .send({ theme: 'invalid-theme-testing' })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Invalid theme");
        });

        it("Should change with valid theme", async () => {
            const result: any = await agent
                .post("/dashboard/themes")
                .send({ theme: 'clean-blog' })
                .set("cookie", cookie)
                .expect(200);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a('object');
            expect(result.body).to.have.property("success");
            expect(result.body.success).to.be.equal("Theme changed");
        });

    });


});

