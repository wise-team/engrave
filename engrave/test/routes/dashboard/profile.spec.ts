import * as request from 'supertest';
import { describe } from 'mocha';
import { expect } from 'chai';
import { server } from '../../../src/app';
import { TestUtils } from '../../TestUtils';

const agent = request(server);

describe('Dashboard: /profile (unauthorized)', () => {

    it('Should not render profile page', async () => {
        const result: any = await agent.get('/dashboard/profile');
        expect(result.statusCode).to.be.equal(401);
    });

    it('Should not post profile (unauthorized)', async () => {
        const result: any = await agent.post('/dashboard/profile').send({});
        expect(result.statusCode).to.be.equal(401);
    });

})

describe('Dashboard: /profile (authorized)', async () => {

    let cookie = null;

    beforeEach(async () => {
        cookie = await TestUtils.login();
    })

    it('Should render profile page', async () => {
        const result: any = await agent.get('/dashboard/profile').set('cookie', cookie);
        expect(result.statusCode).to.be.equal(200);5
    });

    it('Should not post profile (name not provided)', async () => {
        const result: any = await 
            agent
                .post('/dashboard/profile')
                .send({})
                .set('cookie', cookie)
                .expect(400);
        
        expect(result.body).to.be.equal('Name not provided');
    });

    it('Should not post profile (surname not provided)', async () => {
        const result: any = await 
            agent
                .post('/dashboard/profile')
                .set('cookie', cookie)
                .send({ author_name: "test"})
                .expect(400);
        
        expect(result.body).to.be.equal('Surname not provided');
    });

})