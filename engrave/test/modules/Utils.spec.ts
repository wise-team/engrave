import { Utils } from './../../src/modules/Utils';
import { describe } from "mocha";
import { expect } from 'chai';
import { Domains } from '../../src/modules/Domains';

describe("Utils", function () {

    describe("validateCustomDomain", function () {

        it("Should pass on valid domain'", async () => {

            function test() { Domains.validateCustomDomain('example.com'); }

            expect(test).to.not.throw;
        });

        it("Should pass on valid domain'", async () => {

            function test() { Domains.validateCustomDomain('test.me'); }

            expect(test).to.not.throw;
        });

        it("Should throw on invalid short domain'", async () => {

            function test() { Domains.validateCustomDomain('e.c'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw on invalid long domain'", async () => {

            function test() { Domains.validateCustomDomain('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.ccccccccccccccccccccccc'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw on invalid tld'", async () => {

            function test() { Domains.validateCustomDomain('example.c'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw on invalid domain'", async () => {

            function test() { Domains.validateCustomDomain('e.com'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw on invalid domain'", async () => {

            function test() { Domains.validateCustomDomain('e..'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw without tld'", async () => {

            function test() { Domains.validateCustomDomain('test'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw with subdomain'", async () => {

            function test() { Domains.validateCustomDomain('test.test.com'); }

            expect(test).to.throw('Invalid domain name');
        });

        it("Should throw with unsupported TLD'", async () => {

            function test() { Domains.validateCustomDomain('testing.info'); }

            expect(test).to.throw('Invalid domain name');
        });

    });

    describe("generatePaymentLink", function () {
        
        it("Should generate payment link for steem", async () => {
            expect(Utils.generatePaymentLink('steem')).to.equal('https://steemconnect.com/sign/transfer?to=engrave&amount=10.000%20STEEM&memo=Domain%20request');
        });
        
        it("Should generate payment link for STEEM", async () => {
            expect(Utils.generatePaymentLink('STEEM')).to.equal('https://steemconnect.com/sign/transfer?to=engrave&amount=10.000%20STEEM&memo=Domain%20request');
        });

        it("Should generate payment link for Steem", async () => {
            expect(Utils.generatePaymentLink('Steem')).to.equal('https://steemconnect.com/sign/transfer?to=engrave&amount=10.000%20STEEM&memo=Domain%20request');
        });

        it("Should generate payment link for SteeM", async () => {
            expect(Utils.generatePaymentLink('SteeM')).to.equal('https://steemconnect.com/sign/transfer?to=engrave&amount=10.000%20STEEM&memo=Domain%20request');
        });
        
        it("Should generate payment link for sbd", async () => {
            expect(Utils.generatePaymentLink('sbd')).to.equal('https://steemconnect.com/sign/transfer?to=engrave&amount=10.000%20SBD&memo=Domain%20request');
        });

        it("Should generate payment link for SBD", async () => {
            expect(Utils.generatePaymentLink('SBD')).to.equal('https://steemconnect.com/sign/transfer?to=engrave&amount=10.000%20SBD&memo=Domain%20request');
        });

        it("Should generate payment link for Sbd", async () => {
            expect(Utils.generatePaymentLink('Sbd')).to.equal('https://steemconnect.com/sign/transfer?to=engrave&amount=10.000%20SBD&memo=Domain%20request');
        });
        
        it("Should generate payment link for SbD", async () => {
            expect(Utils.generatePaymentLink('SbD')).to.equal('https://steemconnect.com/sign/transfer?to=engrave&amount=10.000%20SBD&memo=Domain%20request');
        });

    });

});