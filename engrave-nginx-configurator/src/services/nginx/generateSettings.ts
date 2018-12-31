import * as path from 'path';
import * as fs  from 'fs';

import validateDomainCertificates from '../ssl/validateDomainCertificates';

const nginxConfDirectory = "/etc/nginx/conf.d/";
const subdomain_template = "server {\r\n\tserver_name SUBDOMAIN;\r\n\treturn 301 https://SUBDOMAIN$request_uri;\r\n}\r\n\r\nserver {\r\n\tlisten 443 ssl;\r\n\tserver_name SUBDOMAIN;\r\n\r\n\tssl_certificate /etc/letsencrypt/live/DOMAIN/fullchain.pem;\r\n\tssl_certificate_key /etc/letsencrypt/live/DOMAIN/privkey.pem;\r\n\t\r\nlocation / {\r\n\tproxy_pass http://engrave:PORT;\r\n\tproxy_http_version 1.1;\r\n\tproxy_set_header Upgrade $http_upgrade;\r\n\tproxy_set_header Connection 'upgrade';\r\n\tproxy_set_header Host $host;\r\n\tproxy_cache_bypass $http_upgrade;\r\nerror_page 500 502 503 504 /maintenance/blog.html;\n\nlocation /maintenance/ {\n\troot /var/www/;\n}\n\t}\r\n}";
const domain_template = `server {\n\tlisten 443;\n\tserver_name EXAMPLE www.EXAMPLE;\n\treturn 301 http://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 80;\n\tserver_name EXAMPLE www.EXAMPLE;\n\nlocation \/ {\n\tproxy_pass http:\/\/engrave:PORT;\n\tproxy_http_version 1.1;\n\tproxy_set_header Upgrade $http_upgrade;\n\tproxy_set_header Connection \'upgrade\';\n\tproxy_set_header Host $host;\n\tproxy_cache_bypass $http_upgrade;\nerror_page 500 502 503 504 /maintenance/blog.html;\n\nlocation /maintenance/ {\n\troot /var/www/;\n}\n\t}\n}`;
const ssl_domain_template = "server {\n\tserver_name www.EXAMPLE EXAMPLE;\n\treturn 301 https://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 443 ssl;\n\tserver_name www.EXAMPLE;\n\n\tssl_certificate /etc/letsencrypt/live/EXAMPLE/fullchain.pem;\n\tssl_certificate_key /etc/letsencrypt/live/EXAMPLE/privkey.pem;\n\t\n\treturn 301 https://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 443 ssl;\n\tserver_name EXAMPLE;\n\n\tssl_certificate /etc/letsencrypt/live/EXAMPLE/fullchain.pem;\n\tssl_certificate_key /etc/letsencrypt/live/EXAMPLE/privkey.pem;\n\n\tlocation / {\n\tproxy_pass http://engrave:PORT;\n\tproxy_http_version 1.1;\n\tproxy_set_header Upgrade $http_upgrade;\n\tproxy_set_header Connection 'upgrade';\n\tproxy_set_header Host $host;\n\tproxy_cache_bypass $http_upgrade;\nerror_page 500 502 503 504 /maintenance/blog.html;\n\nlocation /maintenance/ {\n\troot /var/www/;\n}\n\t}\n}\n";

export default async function generateNginxSettings(domain: string, port: number, is_domain_custom: boolean) {
    let configFilename = port.toString() + "_" + domain + ".conf";
    let configFilePath = path.join(nginxConfDirectory, configFilename);
    let configContent = await generateConfigFileContent(domain, port, is_domain_custom);
    fs.writeFileSync(configFilePath, configContent);
}

function getDomainFromSubdomainString(domain: string) {
    if (domain) {
        let parts = domain.split(".");
        if (parts.length >= 2) {
            return [parts[parts.length - 2], parts[parts.length - 1]].join(".");
        } else return null;
    } else return null;
}

async function generateConfigFileContent(domain: string, port: number, is_domain_custom: boolean) {
    if (is_domain_custom) {
        return await generateConfigForCustomDomain(domain, port);
    } else {
        return await generateConfigForSubdomain(domain, port);
    }
}

async function generateConfigForSubdomain(domain: string, port: number) {
    if (await validateDomainCertificates(getDomainFromSubdomainString(domain))) {
        let tmp1 = subdomain_template.replace(/SUBDOMAIN/g, domain);
        let tmp2 = tmp1.replace(/DOMAIN/g, getDomainFromSubdomainString(domain));
        return tmp2.replace(/PORT/g, port.toString());
    } else {
        let tmp1 = domain_template.replace(/EXAMPLE/g, domain);
        return tmp1.replace(/PORT/g, port.toString());
    }
}

async function generateConfigForCustomDomain(domain: string, port: number) {
    let template = domain_template;
    if (await validateDomainCertificates(domain)) {
        template = ssl_domain_template;
    }
    let tmp1 = template.replace(/EXAMPLE/g, domain);
    return tmp1.replace(/PORT/g, port.toString());
}
