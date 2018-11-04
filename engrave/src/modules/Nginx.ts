import { SSLModule } from './SSL';
import { IBlog } from '../helpers/IBlog';
import { Config } from "../config";
import * as path from 'path';

let fs = require('fs');

let config = Config.GetConfig();

export class NginxModule {
         private static nginxConfDirectory = "/etc/nginx/conf.d/";

         private static subdomain_template = "server {\r\n\tserver_name SUBDOMAIN;\r\n\treturn 301 https://SUBDOMAIN$request_uri;\r\n}\r\n\r\nserver {\r\n\tlisten 443 ssl;\r\n\tserver_name SUBDOMAIN;\r\n\r\n\tssl_certificate /etc/letsencrypt/live/DOMAIN/fullchain.pem;\r\n\tssl_certificate_key /etc/letsencrypt/live/DOMAIN/privkey.pem;\r\n\t\r\nlocation / {\r\n\tproxy_pass http://engrave:PORT;\r\n\tproxy_http_version 1.1;\r\n\tproxy_set_header Upgrade $http_upgrade;\r\n\tproxy_set_header Connection 'upgrade';\r\n\tproxy_set_header Host $host;\r\n\tproxy_cache_bypass $http_upgrade;\r\n\t}\r\n}";
         private static domain_template = `server {\n\tlisten 443;\n\tserver_name EXAMPLE www.EXAMPLE;\n\treturn 301 http://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 80;\n\tserver_name EXAMPLE www.EXAMPLE;\n\nlocation \/ {\n\tproxy_pass http:\/\/engrave:PORT;\n\tproxy_http_version 1.1;\n\tproxy_set_header Upgrade $http_upgrade;\n\tproxy_set_header Connection \'upgrade\';\n\tproxy_set_header Host $host;\n\tproxy_cache_bypass $http_upgrade;\n\t}\n}`;
         private static ssl_domain_template = "server {\n\tserver_name www.EXAMPLE EXAMPLE;\n\treturn 301 https://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 443 ssl;\n\tserver_name www.EXAMPLE;\n\n\tssl_certificate /etc/letsencrypt/live/EXAMPLE/fullchain.pem;\n\tssl_certificate_key /etc/letsencrypt/live/EXAMPLE/privkey.pem;\n\t\n\treturn 301 https://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 443 ssl;\n\tserver_name EXAMPLE;\n\n\tssl_certificate /etc/letsencrypt/live/EXAMPLE/fullchain.pem;\n\tssl_certificate_key /etc/letsencrypt/live/EXAMPLE/privkey.pem;\n\n\tlocation / {\n\tproxy_pass http://engrave:PORT;\n\tproxy_http_version 1.1;\n\tproxy_set_header Upgrade $http_upgrade;\n\tproxy_set_header Connection 'upgrade';\n\tproxy_set_header Host $host;\n\tproxy_cache_bypass $http_upgrade;\n\t}\n}\n";

         static async generateNginxSettings(blog: IBlog) {
           let configFilename = blog.port.toString() + "_" + blog.domain + ".conf";
           let configFilePath = path.join(this.nginxConfDirectory, configFilename);
           let configContent = this.generateConfigFileContent(blog);
           fs.writeFileSync(configFilePath, configContent);
         }

         static isPortalDomainCorrect(domain: string) {
           for (let i in config.blogs_domains) {
             if (config.blogs_domains[i] == domain) {
               return true;
             }
           }
           return false;
         }

         static getDomainFromSubdomainString(domain: string) {
           if (domain) {
             let parts = domain.split(".");
             if (parts.length >= 2) {
               return [parts[parts.length - 2], parts[parts.length - 1]].join(".");
             } else return null;
           } else return null;
         }

         private static generateConfigFileContent(blog: IBlog) {
           if (blog.is_domain_custom) {
             return this.generateConfigForCustomDomain(blog);
           } else {
             return this.generateConfigForSubdomain(blog);
           }
         }

         private static generateConfigForSubdomain(blog: IBlog) {
           if (SSLModule.validateDomainCertificates(this.getDomainFromSubdomainString(blog.domain))) {
             let tmp1 = this.subdomain_template.replace(/SUBDOMAIN/g, blog.domain);
             let tmp2 = tmp1.replace(/DOMAIN/g, NginxModule.getDomainFromSubdomainString(blog.domain));
             return tmp2.replace(/PORT/g, blog.port.toString());
           } else {
             let tmp1 = this.domain_template.replace(/EXAMPLE/g, blog.domain);
             return tmp1.replace(/PORT/g, blog.port.toString());
           }
         }

         private static generateConfigForCustomDomain(blog: IBlog) {
           let template = this.domain_template;
           if (SSLModule.validateDomainCertificates(blog.domain)) {
             template = this.ssl_domain_template;
           }
           let tmp1 = template.replace(/EXAMPLE/g, blog.domain);
           return tmp1.replace(/PORT/g, blog.port.toString());
         }
       }
