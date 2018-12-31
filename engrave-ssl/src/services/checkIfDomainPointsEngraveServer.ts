import * as dns from 'dns';

export default async (domain: string) => {
    return new Promise ( (resolve) => {
        dns.lookup(domain, null, (error, address, family) => {
            if(error) resolve(false);
            else {
                resolve(address == process.env.SERVER_IP);
            }
        });
    })
}