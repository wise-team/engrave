import * as request from 'supertest';
import { describe } from 'mocha';
import { expect } from 'chai';
import { server } from '../../../src/app';

const agent = request(server);

describe('Dashboard: configure', () => {

    it('Should not configure (not authorized)', async () => {
        const result: any = await agent.post('/dashboard/configure/finish');
        expect(result.status).to.be.equal(401);
        expect(result.type).to.be.equal('application/json');
    });
    
})