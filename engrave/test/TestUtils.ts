import { exit } from 'process';
import { Blogs } from '../src/database/BlogsModel';
import {server} from '../src/app';
import * as fs from 'fs';
import * as path from 'path';
import * as nock from 'nock';
import * as request from 'supertest';

export class TestUtils {

    private static loggedUser = { "user": "engrave", "_id": "engrave", "name": "engrave", "account": { "id": 501964, "name": "engrave", "owner": { "weight_threshold": 1, "account_auths": [], "key_auths": [["STM5r6G7EsPUUPYojYhd9nt8dEZ4fwBNUbz2nQyxXHf56ccqVKGFg", 1]] }, "active": { "weight_threshold": 1, "account_auths": [], "key_auths": [["STM6Ex55kgT6YnzpAFFB5Y4kUWhNUvLukgJpPqVVwebXqur6QD1Yy", 1]] }, "posting": { "weight_threshold": 1, "account_auths": [["busy.app", 1], ["engrave.app", 1], ["glodniwiedzy.app", 1], ["steemauto", 1], ["steembler.app", 1], ["steemitlabs.app", 1], ["steempeak.app", 1], ["utopian-ext.app", 1]], "key_auths": [["STM57zUjDUTq2xnfoPA8ukKB6SY4jVPknkiNrEWZdZi2XgnK6J3yc", 1]] }, "memo_key": "STM7vws7RdiBQiegnzjA3wYdemLENGbw765iA8VhE4UYCgS48yMr3", "json_metadata": "{\"profile\":{\"profile_image\":\"https://i.imgur.com/V5jyh42.png\"}}", "proxy": "noisy", "last_owner_update": "1970-01-01T00:00:00", "last_account_update": "2018-10-07T17:38:12", "created": "2017-12-17T01:14:12", "mined": false, "recovery_account": "nicniezgrublem", "last_account_recovery": "1970-01-01T00:00:00", "reset_account": "null", "comment_count": 0, "lifetime_vote_count": 0, "post_count": 1421, "can_vote": true, "voting_manabar": { "current_mana": "14857379144", "last_update_time": 1540557615 }, "voting_power": 9590, "balance": "0.035 STEEM", "savings_balance": "0.000 STEEM", "sbd_balance": "0.081 SBD", "sbd_seconds": "90370428", "sbd_seconds_last_update": "2018-08-01T11:41:57", "sbd_last_interest_payment": "2018-07-13T04:41:57", "savings_sbd_balance": "0.000 SBD", "savings_sbd_seconds": "0", "savings_sbd_seconds_last_update": "1970-01-01T00:00:00", "savings_sbd_last_interest_payment": "1970-01-01T00:00:00", "savings_withdraw_requests": 0, "reward_sbd_balance": "0.000 SBD", "reward_steem_balance": "0.000 STEEM", "reward_vesting_balance": "6.056804 VESTS", "reward_vesting_steem": "0.003 STEEM", "vesting_shares": "15491.844022 VESTS", "delegated_vesting_shares": "0.000000 VESTS", "received_vesting_shares": "0.000000 VESTS", "vesting_withdraw_rate": "0.000000 VESTS", "next_vesting_withdrawal": "1969-12-31T23:59:59", "withdrawn": 0, "to_withdraw": 0, "withdraw_routes": 0, "curation_rewards": 150, "posting_rewards": 11381, "proxied_vsf_votes": [0, 0, 0, 0], "witnesses_voted_for": 0, "last_post": "2018-10-16T21:00:21", "last_root_post": "2018-10-16T21:00:21", "last_vote_time": "2018-10-26T12:40:15", "post_bandwidth": 0, "pending_claimed_accounts": 0, "vesting_balance": "0.000 STEEM", "reputation": "46924021522", "transfer_history": [], "market_history": [], "post_history": [], "vote_history": [], "other_history": [], "witness_votes": [], "tags_usage": [], "guest_bloggers": [] }, "scope": ["login", "vote", "comment", "comment_options", "claim_reward_balance", "delete_comment"], "user_metadata": {} };

    private static async dropDatabase() {
        await Blogs.deleteMany({});
    }

    private static  async prepareDatabase() {
        const databaseMockup = fs.readFileSync(path.join(__dirname, 'database', 'blogs.json'), 'utf-8');

        const blogs = JSON.parse(databaseMockup);
        for (const blog of blogs) {
            await Blogs.create(blog);
        }
    }
    

    static async prepare() {
        try {
            this.mockSteemconnect();
            await this.dropDatabase();
            await this.prepareDatabase();
        } catch (error) {
            console.error(error);
            exit(1);
        }
    } 
    
    static async login() {
        try {
            let result:any = await request(server).get('/authorize?access_token=testing');
            return result.headers['set-cookie'];
        } catch (error) {
            console.error(error);
            exit(1);
        }
    }

    static async logout() {
        try {
            await request(server).get('/authorize/logout');
        } catch (error) {
            console.error(error);
            exit(1);
        }
    }

    private static mockSteemconnect() {
        nock('https://steemconnect.com/api')
            .post('/me')
            .reply(200, this.loggedUser);
    }

}

// // Auxiliary function.
// function createLoginCookie(server, loginDetails, done) {
//     request()
//         .post(server)
//         .send(loginDetails)
//         .end(function (error, response) {
//             if (error) {
//                 throw error;
//             }
//             var loginCookie = response.headers['set-cookie'];
//             done(loginCookie);
//         });
// }
// // Using auxiliary function in test cases.
// createLoginCookie(server, loginDetails, function (cookie) {
//     request(application)
//         .get('/myapi/admin')
//         .set('cookie', cookie)
//         .expect(200, done);
// });