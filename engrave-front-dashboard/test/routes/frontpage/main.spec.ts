import * as request from 'supertest';
import { describe } from 'mocha';
import { expect } from 'chai';
import { server } from '../../../src/app';

const agent = request(server);

describe('Frontpage: main', () => {

    it('Should render main page', async () => {
        const result: any = await agent.get('/');
        expect(result.statusCode).to.be.equal(200);
    });

    it('Should not render invalid address', async () => {
        const result: any = await agent.get('/invalid-address');
        expect(result.statusCode).to.be.equal(302);
    });

})