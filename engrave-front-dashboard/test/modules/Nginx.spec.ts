import { NginxModule } from './../../src/modules/Nginx';
import { describe } from 'mocha';
import { expect } from 'chai';
import { TestUtils } from '../TestUtils';

describe('Nginx', function () {

    describe('getDomainFromSubdomainString', function () {
        this.timeout(5000);

        beforeEach(async () => {
            await TestUtils.prepare();
        })

        it('Should return domain from subdomain string', () => {
            expect(NginxModule.getDomainFromSubdomainString('sub.engrave.website')).equal('engrave.website');
        });

        it('Should return dmain from top level domain string', () => {
            expect(NginxModule.getDomainFromSubdomainString('example.com')).equal('example.com');
        });

        it('Should return null from invalid string', () => {
            expect(NginxModule.getDomainFromSubdomainString('invalid')).to.be.null;
        });

    });

});