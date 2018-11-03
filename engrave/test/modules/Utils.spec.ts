import { Utils } from './../../src/modules/Utils';
import { describe } from "mocha";
import { expect } from 'chai';
import { TestUtils } from '../TestUtils';

describe("Utils", function () {

    describe("validateCustomDomain", function () {

        it("Should pass on valid domain'", async () => {

            function test() { Utils.validateCustomDomain('example.com'); }

            expect(test).to.not.throw;
        });

        it("Should pass on valid domain'", async () => {

            function test() { Utils.validateCustomDomain('test.me'); }

            expect(test).to.not.throw;
        });

        it("Should throw on invalid short domain'", async () => {

            function test() { Utils.validateCustomDomain('e.c'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw on invalid long domain'", async () => {

            function test() { Utils.validateCustomDomain('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.ccccccccccccccccccccccc'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw on invalid tld'", async () => {

            function test() { Utils.validateCustomDomain('example.c'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw on invalid domain'", async () => {

            function test() { Utils.validateCustomDomain('e.com'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw on invalid domain'", async () => {

            function test() { Utils.validateCustomDomain('e..'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw without tld'", async () => {

            function test() { Utils.validateCustomDomain('test'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw with subdomain'", async () => {

            function test() { Utils.validateCustomDomain('test.test.com'); }

            expect(test).to.throw('Invalid domain name');
        });

    });

    describe("generatePaymentLink", function () {
        
        it("Should generate payment link for steem", async () => {
            // expect(Utils.generatePaymentLink('steem')).to.equal('sds');
        });
        
        it("Should generate payment link for STEEM", async () => {
            // expect(Utils.generatePaymentLink('steem')).to.equal('sds');
        });

        it("Should generate payment link for Steem", async () => {
            // expect(Utils.generatePaymentLink('steem')).to.equal('sds');
        });

        it("Should generate payment link for SteeM", async () => {
            // expect(Utils.generatePaymentLink('steem')).to.equal('sds');
        });
        
        it("Should generate payment link for sbd", async () => {
            // expect(Utils.generatePaymentLink('steem')).to.equal('sds');
        });

        it("Should generate payment link for SBD", async () => {
            // expect(Utils.generatePaymentLink('steem')).to.equal('sds');
        });

        it("Should generate payment link for Sbd", async () => {
            // expect(Utils.generatePaymentLink('steem')).to.equal('sds');
        });
        
        it("Should generate payment link for SbD", async () => {
            // expect(Utils.generatePaymentLink('steem')).to.equal('sds');
        });

    });

});