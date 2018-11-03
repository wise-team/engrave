import * as superagent from 'superagent';


export class Domains {

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
                .post('https://<username>:<token>@api.dev.name.com/v4/domains')
                .accept('json')
                .send(orderRequest)

            const createdDomainResponse = JSON.parse(result.text);
            console.log(createdDomainResponse);

        } catch (error) {
            console.log(error);
            throw error;
        }     

    }

    static async validateDomainAvailability(domain: string) {
        const result = await superagent
            .post('https://<username>:<token>@api.dev.name.com/v4/domains:checkAvailability')
            .accept('json')
            .send({ "domainNames": [domain] })

        const response = JSON.parse(result.text);

        if (!response.results[0].purchasable) throw new Error('Domain not available');
        if (response.results[0].purchaseType != 'registration') throw new Error("Domain already taken");
    }

    static async isDomainAvailble(domain: string) {
        
        try {

            const result = await superagent
                .post('https://<username>:<token>@api.dev.name.com/v4/domains:checkAvailability')
                .accept('json')
                .send({ "domainNames": [domain] })

            const response = JSON.parse(result.text);
            
            if (!response.results[0].purchasable) throw new Error('Domain not available');
            if (response.results[0].purchaseType != 'registration') throw new Error("Domain already taken");
            
            return true;

        } catch (error) {
           return false;
        }

    }

    static async getDomainInformation(domain: string) {
        try {
            const result = await superagent
                .post('https://<username>:<token>@api.dev.name.com/v4/domains:checkAvailability')
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
                .get(`https://<username>:<token>@api.dev.name.com/v4/domains/${domain}/records`)
                .accept('json')

            const response = JSON.parse(result.text);
            if(response.records) return response.records;
            else return [];

        } catch (error) {
            return [];
        }
    }

    private static async setDomainRecordForEngrave(record: any, domain: string) {
        await superagent
            .put(`https://<username>:<token>@api.dev.name.com/v4/domains/${domain}/records/${record.id}`)
            .accept('json')
            .send({
                host: record.host,
                type: 'A',
                answer: process.env.SERVER_IP,
                ttl: 300
            });
    }

    private static async createDomainRecordsForEngrave(domain: string) {
        await superagent
            .post(`https://<username>:<token>@api.dev.name.com/v4/domains/${domain}/records`)
            .accept('json')
            .send({
                host: '@', 
                type: 'A', 
                answer: process.env.SERVER_IP, 
                ttl: 300
            });

        await superagent
            .post(`https://<username>:<token>@api.dev.name.com/v4/domains/${domain}/records`)
            .accept('json')
            .send({
                host: 'www', 
                type: 'A', 
                answer: process.env.SERVER_IP, 
                ttl: 300
            });
    }
  
    private static async getDomainPrice(domain: string): Promise<number> {
        const result = await superagent
            .post('https://<username>:<token>@api.dev.name.com/v4/domains:checkAvailability')
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
                    await this.setDomainRecordForEngrave(record, domain);
                }
            } else {
                await this.createDomainRecordsForEngrave(domain)
            }

            const configuredRecords = await this.getDomainRecords(domain);
            console.log(configuredRecords);

        } catch (error) {
            console.log(error);
            throw new Error("Error while configuring records for domain")
        }
    }

    private static async prepareOrderRequest(domain: string) {
        return {
            domain: {
                domainName: domain
            },
            purchasePrice: await this.getDomainPrice(domain)
        }; 
    }
}