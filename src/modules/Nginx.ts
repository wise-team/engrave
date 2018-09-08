import { Config } from "../config";

let fs = require('fs');

let config = Config.GetConfig();

export class NginxModule {

    private static subdomain_template = 'server {\r\n\tserver_name SUBDOMAIN;\r\n\treturn 301 https://SUBDOMAIN$request_uri;\r\n}\r\n\r\nserver {\r\n\tlisten 443 ssl;\r\n\tserver_name SUBDOMAIN;\r\n\r\n\tssl_certificate \/etc\/letsencrypt\/live\/DOMAIN\/fullchain.pem;\r\n\tssl_certificate_key \/etc\/letsencrypt\/live\/DOMAIN\/privkey.pem;\r\n\t\r\nlocation \/ {\r\n\tproxy_pass http:\/\/localhost:PORT;\r\n\tproxy_http_version 1.1;\r\n\tproxy_set_header Upgrade $http_upgrade;\r\n\tproxy_set_header Connection \'upgrade\';\r\n\tproxy_set_header Host $host;\r\n\tproxy_cache_bypass $http_upgrade;\r\n\t}\r\n}';
    private static domain_template = 'server {\n\tlisten 80;\n\n\tserver_name EXAMPLE www.EXAMPLE;\n\nlocation \/ {\n\tproxy_pass http:\/\/localhost:PORT;\n\tproxy_http_version 1.1;\n\tproxy_set_header Upgrade $http_upgrade;\n\tproxy_set_header Connection \'upgrade\';\n\tproxy_set_header Host $host;\n\tproxy_cache_bypass $http_upgrade;\n   }\n}\n\n';
    private static ssl_domain_template = 'server {\n\tserver_name www.EXAMPLE EXAMPLE;\n\treturn 301 https://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 443 ssl;\n\tserver_name www.EXAMPLE;\n\n\tssl_certificate /etc/letsencrypt/live/EXAMPLE/fullchain.pem;\n\tssl_certificate_key /etc/letsencrypt/live/EXAMPLE/privkey.pem;\n\t\n\treturn 301 https://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 443 ssl;\n\tserver_name EXAMPLE;\n\n\tssl_certificate /etc/letsencrypt/live/EXAMPLE/fullchain.pem;\n\tssl_certificate_key /etc/letsencrypt/live/EXAMPLE/privkey.pem;\n\n\tlocation / {\n\tproxy_pass http://localhost:PORT;\n\tproxy_http_version 1.1;\n\tproxy_set_header Upgrade $http_upgrade;\n\tproxy_set_header Connection \'upgrade\';\n\tproxy_set_header Host $host;\n\tproxy_cache_bypass $http_upgrade;\n\t}\n}\n';

    static generateSubdomainConfig (subdomain: string, port: any, cb: any) {
        let tmp1 = this.subdomain_template.replace(/SUBDOMAIN/g, subdomain);
        let tmp2 = tmp1.replace(/DOMAIN/g, NginxModule.getDomainFromString(subdomain));
        let tmp3 = tmp2.replace(/PORT/g, port);

        fs.writeFile("/etc/nginx/conf.d/" + port + '_' + subdomain + ".conf", tmp3, (err: Error) => {
            if (!err) {
                console.log(' * Subdomain config for NGINX has been saved successfully');
            }

            if (cb) {
                cb(err);
            }
        });
    };

    static generateCustomDomainConfig (domain: string, port: any, cb: any) {
        let tmp1 = this.domain_template.replace(/EXAMPLE/g, domain);
        let tmp2 = tmp1.replace(/PORT/g, port);

        fs.writeFile("/etc/nginx/conf.d/" + port + '_' + domain + ".conf", tmp2, (err: Error) => {
            if (!err) {
                console.log(' * Domain config for NGINX has been saved successfully');
            }

            if (cb) {
                cb(err);
            }
        });
    };

    static generateCustomDomainConfigWithSSL(domain: string, port: any, cb: any) {
        let tmp1 = this.ssl_domain_template.replace(/EXAMPLE/g, domain);
        let tmp2 = tmp1.replace(/PORT/g, port);

        fs.writeFile("/etc/nginx/conf.d/" + port + '_' + domain + ".conf", tmp2, (err: Error) => {
            if (!err) {
                console.log(' * Domain config for NGINX has been saved successfully');
            }

            if (cb) {
                cb(err);
            }
        });
    }

    static isBlogDomainCorrect(domain: string) {
        for (let i in config.blogs_domains) {
            if (config.blogs_domains[i] == domain) {
                return true;
            }
        }
        return false;
    }

    static getDomainFromString(domain: string) {
        if (domain) {
            let parts = domain.split('.');
            if (parts.length >= 2) {
                return [parts[parts.length - 2], parts[parts.length - 1]].join('.');
            } else return null;
        } else return null;
    }

}
