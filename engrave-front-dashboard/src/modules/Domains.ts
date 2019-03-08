import * as superagent from 'superagent';
import * as _ from 'lodash';
import { Blogs } from '../submodules/engrave-shared/models/Blogs';

let CronJob = require('cron').CronJob;
let steem = require('steem');
let parseDomain = require('parse-domain');
const secrets = require('@cloudreach/docker-secrets');

export class Domains {

    private static token = secrets.NAMECOM_TOKEN ? secrets.NAMECOM_TOKEN : process.env.NAMECOM_TOKEN;
    private static username = secrets.NAMECOM_USERNAME ? secrets.NAMECOM_USERNAME : process.env.NAMECOM_USERNAME;
    private static apiAuthorizedAddress = `https://${Domains.username}:${Domains.token}@${process.env.NAMECOM_API}/v4/domains`;
    private static domainMaxPrice = 11;

    private static availableTlds = ['rocks', 'xyz', 'world', 'space', 'site', 'website', 'me', 'eu', 'com', 'org', 'buzz', 'net'];
    
    constructor() {

        if(Domains.token && Domains.username) {
            console.log(" * Domains processing module initialized");
            new CronJob('*/1 * * * *', Domains.checkSteemHistory, null, true, 'America/Los_Angeles');
        } else {
            console.log(" * Domains processing module not initialized (athorization not provided)");
        }

    }

    private static async checkSteemHistory() {

        try {

            const operations = await steem.api.getAccountHistoryAsync('engrave', -1, 25);
            const transfers = operations.filter((tx: any) => (tx[1].op[0] == 'transfer') && (tx[1].op[1].amount == process.env.DOMAIN_PRICE_SBD + '.000 SBD' || tx[1].op[1].amount == process.env.DOMAIN_PRICE_STEEM + '.000 STEEM'));

            for (const transfer of transfers) {
                try {
                    const from = transfer[1].op[1].from;
                    let blogger = await Blogs.findOne({ steem_username: from });

                    if (blogger && !blogger.paid && !blogger.configured && blogger.domain) {
                        console.log(` * Trying to buy ${blogger.domain} for ${blogger.steem_username}`);
                        await Domains.processDomainOrder(blogger.domain);
                        blogger.paid = true;
                        await blogger.save();
                    }
                } catch (error) {
                    console.log(" * Registering domain error: ", error);
                }
            }

        } catch (err) {
            console.log("Domain order watcher error", err);
        }
    }

    static async processDomainOrder(domain: string) {
        try { 
            await this.validateDomainAvailability(domain)
            await this.buyNewDomain(domain);
            await this.configureRecords(domain);
        } catch (error) {
            console.log(error);
            throw error;        
        }
    }

    private static async buyNewDomain(domain: string) {

        try {
            const orderRequest = await this.prepareOrderRequest(domain)
            const result = await superagent
                .post(this.apiAuthorizedAddress)
                .accept('json')
                .send(orderRequest)
        } catch (error) {
            console.log(error);
            throw error;
        }     

    }

    static async validateDomainAvailability(domain: string) {
        const result = await superagent
            .post(this.apiAuthorizedAddress + ':checkAvailability')
            .accept('json')
            .send({ "domainNames": [domain] })

        const response = JSON.parse(result.text);

        if (!response.results[0].purchasable) throw new Error('Domain not available');
        if (response.results[0].purchaseType != 'registration') throw new Error("Domain already taken");
        if (response.results[0].purchasePrice > Domains.domainMaxPrice) throw new Error("Domain not available");
    }

    static async isDomainAvailable(domain: string) {
        
        try {

            const result = await superagent
                .post(this.apiAuthorizedAddress + ':checkAvailability')
                .accept('json')
                .send({ "domainNames": [domain] })

            const response = JSON.parse(result.text);
            
            if (response.results[0].premium) throw new Error('Domain not available');
            if (!response.results[0].purchasable) throw new Error('Domain not available');
            if (response.results[0].purchasePrice > Domains.domainMaxPrice) throw new Error("Domain not available");
            if (response.results[0].purchaseType != 'registration') throw new Error("Domain already taken");
            
            return true;

        } catch (error) {
           return false;
        }

    }

    static async getDomainInformation(domain: string) {
        try {
            const result = await superagent
                .post(this.apiAuthorizedAddress + ':checkAvailability')
                .accept('json')
                .send({ "domainNames": [domain] })

            const response = JSON.parse(result.text);

            return response.results[0];
        } catch (error) {
            return null;
        }
    }

    private static async getDomainRecords(domain: string) {

        try {
            const result = await superagent
                .get(this.apiAuthorizedAddress + `/${domain}/records`)
                .accept('json')

            const response = JSON.parse(result.text);
            if(response.records) return response.records;
            else return [];

        } catch (error) {
            return [];
        }
    }

    private static async updateDomainRecordForEngrave(record: any, domain: string) {
        const answer = await superagent
            .put(this.apiAuthorizedAddress + `/${domain}/records/${record.id}`)
            .accept('json')
            .send({
                host: record.host,
                type: 'A',
                answer: process.env.SERVER_IP,
                ttl: 300
            });           
    }

    private static async createDomainRecordsForEngrave(domain: string) {
        let record = await superagent
            .post(this.apiAuthorizedAddress + `/${domain}/records`)
            .accept('json')
            .send({
                host: '@', 
                type: 'A', 
                answer: process.env.SERVER_IP, 
                ttl: 300
            });
    
        record = await superagent
            .post(this.apiAuthorizedAddress + `/${domain}/records`)
            .accept('json')
            .send({
                host: 'www', 
                type: 'A', 
                answer: process.env.SERVER_IP, 
                ttl: 300
            });

        record = await superagent
            .post(this.apiAuthorizedAddress + `/${domain}/records`)
            .accept('json')
            .send({
                host: '*', 
                type: 'A', 
                answer: process.env.SERVER_IP, 
                ttl: 300
            });
   }
  
    static async getDomainPrice(domain: string): Promise<number> {
        const result = await superagent
            .post(this.apiAuthorizedAddress + ':checkAvailability')
            .accept('json')
            .send({ "domainNames": [domain] })

        return JSON.parse(result.text).results[0].purchasePrice;
    }
    
    private static async configureRecords(domain: string) {
        try {
            const records = await this.getDomainRecords(domain);
            let filteredARecords = records.filter((record: any) => record.type == 'A');

            if (filteredARecords.length) {
                for (const record of filteredARecords) {
                    await this.updateDomainRecordForEngrave(record, domain);
                }
            } else {
                await this.createDomainRecordsForEngrave(domain)
            }

        } catch (error) {
            console.log(error);
            throw new Error("Error while configuring records for domain")
        }
    }

    private static async prepareOrderRequest(domain: string) {
        const price = await this.getDomainPrice(domain);
        
        if(price > Domains.domainMaxPrice) throw new Error('Domain price is too high!');
        
        return {
            domain: {
                domainName: domain
            },
            purchasePrice: price
        }; 
    }

    static validateCustomDomain(domain: string) {
        try {
            const domainObject = parseDomain(domain);
            const regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g;
            if (!_.includes(this.availableTlds, domainObject.tld)) throw new Error("Unsupported TLD");
            if (!regex.test(domain)) throw new Error("Invalid domain name")       
        } catch (error) {
            throw new Error("Invalid domain name");
        }
    }
}