import { BlogListModule } from '../../src/modules/BlogList';
import { describe } from "mocha";
import { expect } from 'chai';
import { TestUtils } from '../TestUtils';

describe("BlogList", function () {

    describe("buildSearchableDomain", function () {
        this.timeout(5000);

        beforeEach(async () => {
            await TestUtils.prepare();
        })

        it("Should build searchable domain from http://engrave.website", () => {
            expect(BlogListModule.buildSearchableDomain("http://engrave.website")).equal("engrave.website");
        });

        it("Should build searchable domain from https://engrave.website", () => {
            expect(BlogListModule.buildSearchableDomain("https://engrave.website")).equal("engrave.website");
        });

        it("Should build searchable domain from http://blog.engrave.website", () => {
            expect(BlogListModule.buildSearchableDomain("http://blog.engrave.website")).equal("blog.engrave.website");
        });

        it("Should build searchable domain from https://blog.engrave.website", () => {
            expect(BlogListModule.buildSearchableDomain("https://blog.engrave.website")).equal("blog.engrave.website");
        });

        it("Should throw when trying to build domain from invalid string", function () {
            const wrapperFunction = () => {
                BlogListModule.buildSearchableDomain("invalidstring");
            }
            expect(wrapperFunction).to.throw();
        });
    });

    describe("isBlogDomainAvailable", function () {
        this.timeout(5000);

        beforeEach(async () => {
            await TestUtils.prepare();
        })

        it("Should prevent to configure 'www.example.com'", async () => {
            expect(await BlogListModule.isBlogDomainAvailable('www.example.com')).to.be.false;
        });

        it("Should prevent to configure 'blog.example.com'", async () => {
            expect(await BlogListModule.isBlogDomainAvailable('www.example.com')).to.be.false;
        });

        it("Should prevent to configure incorrect domain name'", async () => {
            expect(await BlogListModule.isBlogDomainAvailable('testing.testing')).to.be.false;
        });

        it("Should allow to configure 'someavailablesubdomain.example.com'", async () => {
            expect(await BlogListModule.isBlogDomainAvailable('someavailablesubdomain.example.com')).to.be.true;
        });
    });

    describe("isBlogRegistered", function () {
        this.timeout(5000);

        beforeEach(async () => {
            await TestUtils.prepare();
        })

        it("Should return true on already created blog'", async () => {
            expect(await BlogListModule.isBlogRegistered('engrave.engrave.website')).to.be.true;
        });

        it("Should return false on available blog'", async () => {
            expect(await BlogListModule.isBlogRegistered('testing.engrave.website')).to.be.false;
        });

    });

    describe("listAllBlogDomains", function () {
        this.timeout(5000);

        beforeEach(async () => {
            await TestUtils.prepare();
        })

        it("Should return array with one blog'", async () => {
            const blogs = await BlogListModule.listAllBlogDomains();
            expect(blogs).to.be.an('array');
            expect(blogs.length).equal(1);
        });
    });

});