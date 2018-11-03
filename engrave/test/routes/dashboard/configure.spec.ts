import * as request from "supertest";
import { describe } from "mocha";
import { expect } from "chai";
import { server } from "../../../src/app";
import { TestUtils } from "../../TestUtils";

const agent = request(server);

describe("Dashboard: /configure", () => {
    describe("Not authorized", () => {
        it("Should not configure", async () => {
            const result: any = await agent.post("/dashboard/configure/finish");
            expect(result.status).to.be.equal(401);
            expect(result.type).to.be.equal("application/json");
        });
    });

    describe("Authorized and configured", async () => {
        let cookie: string = null;

        beforeEach(async () => {
            cookie = await TestUtils.login("configured");
        });

        it("Should not configure because already configured", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    domain: "engrave.website",
                    blog_title: "Test Title",
                    blog_slogan: "Test Slogan",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("You already configured your blog!");
        });
    });

    describe("Authorized and NOT configured", async () => {
        let cookie: string = null;

        beforeEach(async () => {
            await TestUtils.prepare();
            cookie = await TestUtils.login("not_configured");
        });

        it("Should configure", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    domain: "engrave.website",
                    blog_title: "Test Title",
                    blog_slogan: "Test Slogan",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(200);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
        });

        it("Should not configure with empty request", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({})
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Domain not provided");
        });

        it("Should not configure with prohibited subdomain", async () => {
          const result: any = await agent
            .post("/dashboard/configure/finish")
            .send({
              subdomain: "blog",
              domain: "engrave.website",
              blog_title: "Test Title",
              blog_slogan: "Test Slogan",
              theme: "clean-blog",
              category: 'Other'
            })
            .set("cookie", cookie)
            .expect(400);

          expect(result.type).to.be.equal("application/json");
          expect(result.body).to.be.a("object");
          expect(result.body).to.have.property("error");
          expect(result.body.error).to.be.equal("Blog with that address already exist");
        });

        it("Should not configure with prohibited subdomain", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: 'www',
                    domain: "engrave.website",
                    blog_title: "Test Title",
                    blog_slogan: "Test Slogan",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Blog with that address already exist");
        });

        it("Should not configure with taken subdomain", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: 'engrave',
                    domain: "engrave.website",
                    blog_title: "Test Title",
                    blog_slogan: "Test Slogan",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Blog with that address already exist");
        });
        it("Should not configure with prohibited domain", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    domain: "example.com",
                    blog_title: "Test Title",
                    blog_slogan: "Test Slogan",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Blog with that address already exist");
        });

        it("Should not configure without domain", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    blog_title: "Test Title",
                    blog_slogan: "Test Slogan",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Domain not provided");
        });

        it("Should not configure without title", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    domain: "engrave.website",
                    blog_slogan: "Test Slogan",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Title not provided");
        });

        it("Should not configure with empty title", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    domain: "engrave.website",
                    blog_title: "",
                    blog_slogan: "Test Slogan",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Title cannot be empty");
        });

        it("Should not configure with too short title", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    domain: "engrave.website",
                    blog_title: "T",
                    blog_slogan: "Test Slogan",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Title too short");
        });

        it("Should not configure with too long title", async () => {
            const result: any = await agent
              .post("/dashboard/configure/finish")
              .send({
                subdomain: "test",
                domain: "engrave.website",
                blog_title: "918880171673906683945128712036139106100407898467713952567335304418360920605782427793234625553803924811379469707519161765",
                blog_slogan: "Test Slogan",
                theme: "clean-blog",
                category: 'Other'
              })
              .set("cookie", cookie)
              .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Title too long");
        });

        it("Should not configure without slogan", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    domain: "engrave.website",
                    blog_title: "Test Title",
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Slogan not provided");
        });
        
        it("Should not configure with too long slogan", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    domain: "engrave.website",
                    blog_title: "Test Title",
                    blog_slogan: '918880171673906683945128712036139106100407898467713952567335304418360920605782427793234625553803924811379469707519161765',
                    theme: "clean-blog",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Slogan too long");
        });

        it("Should not configure without theme", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    domain: "engrave.website",
                    blog_title: "Test Title",
                    blog_slogan: "Test Slogan",
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Theme not provided");
        });

        it("Should not configure with invalid theme", async () => {
            const result: any = await agent
                .post("/dashboard/configure/finish")
                .send({
                    subdomain: "test",
                    domain: "engrave.website",
                    blog_title: "Test Title",
                    blog_slogan: "Test Slogan",
                    theme: 'invalid-theme',
                    category: 'Other'
                })
                .set("cookie", cookie)
                .expect(400);

            expect(result.type).to.be.equal("application/json");
            expect(result.body).to.be.a("object");
            expect(result.body).to.have.property("error");
            expect(result.body.error).to.be.equal("Invalid theme provided");
        });

        it("Should not configure without category", async () => {
          const result: any = await agent
            .post("/dashboard/configure/finish")
            .send({
              subdomain: "test",
              domain: "engrave.website",
              blog_title: "Test Title",
              blog_slogan: "Test Slogan",
              theme: 'clean-blog'
            })
            .set("cookie", cookie)
            .expect(400);

          expect(result.type).to.be.equal("application/json");
          expect(result.body).to.be.a("object");
          expect(result.body).to.have.property("error");
          expect(result.body.error).to.be.equal("Category not provided");
        });

        it("Should not configure with invalid category", async () => {
          const result: any = await agent
            .post("/dashboard/configure/finish")
            .send({
              subdomain: "test",
              domain: "engrave.website",
              blog_title: "Test Title",
              blog_slogan: "Test Slogan",
              theme: 'clean-blog',
              category: 'invalid-category'
            })
            .set("cookie", cookie)
            .expect(400);

          expect(result.type).to.be.equal("application/json");
          expect(result.body).to.be.a("object");
          expect(result.body).to.have.property("error");
          expect(result.body.error).to.be.equal("Invalid category provided");
        });
    });

});



