import * as request from 'supertest';
import { describe } from 'mocha';
import { expect } from 'chai';
import { server } from '../../../src/app';
import { TestUtils } from '../../TestUtils';

const agent = request(server);

describe('Dashboard: /posts (unauthorized)', () => {

    it('Should not get posts (not authorized)', async () => {
        const result: any = await agent.get('/dashboard/posts');
        expect(result.statusCode).to.be.equal(401);
    });
    
    it('Should not get more posts (not authorized)', async () => {
        const result: any = await agent.post('/dashboard/posts');
        expect(result.statusCode).to.be.equal(401);
    });

    it('Should not get posts (not authorized)', async () => {
        const result: any = await agent.get('/dashboard/edit/test-post-permlink');
        expect(result.statusCode).to.be.equal(401);
    });

    it('Should not edit (not authorized)', async () => {
        const result: any = await agent.post('/dashboard/edit');
        expect(result.statusCode).to.be.equal(401);
    });

    it('Should not delete (not authorized)', async () => {
        const result: any = await agent.post('/dashboard/delete');
        expect(result.statusCode).to.be.equal(401);
    });

    it('Should not publish (not authorized)', async () => {
        const result: any = await agent.post('/dashboard/publish');
        expect(result.statusCode).to.be.equal(401);
    });

    it('Should not add draft (not authorized)', async () => {
        const result: any = await agent.post('/dashboard/draft');
        expect(result.statusCode).to.be.equal(401);
    });
    
    it('Should not delete draft (not authorized)', async () => {
        const result: any = await agent.post('/dashboard/draft/delete');
        expect(result.statusCode).to.be.equal(401);
    });
    
    it('Should not publish draft (not authorized)', async () => {
        const result: any = await agent.post('/dashboard/draft/publish');
        expect(result.statusCode).to.be.equal(401);
    });
    
})

describe('Dashboard: /posts (authorized)', async () => {
    
    let cookie: string = null;

    before(async () => {
        cookie = await TestUtils.login();
    })

    it('Should get more posts (authorized)', async () => {

        const result: any = await agent.get('/dashboard/posts').set('cookie', cookie);
        expect(result.status).to.be.equal(200);
    });

})