import * as path from 'path';
import * as fs  from 'fs';

import validateDomainCertificates from '../ssl/validateDomainCertificates';

const nginxConfDirectory = "/etc/nginx/conf.d/";
const domain_template = `server {\n\tlisten 443;\n\tserver_name EXAMPLE www.EXAMPLE;\n\treturn 301 http://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 80;\n\tserver_name EXAMPLE www.EXAMPLE;\n\n\tlocation \/ {\n\t\tproxy_pass http:\/\/blogs-renderer:8080;\n\t\tproxy_http_version 1.1;\n\t\tproxy_set_header Upgrade $http_upgrade;\n\t\tproxy_set_header Connection \'upgrade\';\n\t\tproxy_set_header Host $host;\n\t\tproxy_cache_bypass $http_upgrade;\n\t\t\n\t\terror_page 500 502 503 504 /maintenance/blog.html;\n\n\t\tlocation /maintenance/ {\n\t\t\troot /var/www/;\n\t\t}\n\t}\n}`;
const ssl_domain_template = "server {\n\tserver_name www.EXAMPLE EXAMPLE;\n\treturn 301 https://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 443 ssl;\n\tserver_name www.EXAMPLE;\n\n\tssl_certificate /etc/letsencrypt/live/EXAMPLE/fullchain.pem;\n\tssl_certificate_key /etc/letsencrypt/live/EXAMPLE/privkey.pem;\n\n\treturn 301 https://EXAMPLE$request_uri;\n}\n\nserver {\n\tlisten 443 ssl;\n\tserver_name EXAMPLE;\n\n\tssl_certificate /etc/letsencrypt/live/EXAMPLE/fullchain.pem;\n\tssl_certificate_key /etc/letsencrypt/live/EXAMPLE/privkey.pem;\n\n\tlocation / {\n\t\tproxy_pass http://blogs-renderer:8080;\n\t\tproxy_http_version 1.1;\n\t\tproxy_set_header Upgrade $http_upgrade;\n\t\tproxy_set_header Connection 'upgrade';\n\t\tproxy_set_header Host $host;\n\t\tproxy_cache_bypass $http_upgrade;\n\t\terror_page 500 502 503 504 /maintenance/blog.html;\n\n\t\tlocation /maintenance/ {\n\t\t\troot /var/www/;\n\t\t}\n\t}\n}\n";

export default async function generateNginxSettings(domain: string, port: number, is_domain_custom: boolean) {

    console.log("Generating configuration for: ", domain);

    let configFilename = port.toString() + "_" + domain + ".conf";
    let configFilePath = path.join(nginxConfDirectory, configFilename);
    let configContent = await generateConfigFileContent(domain, port, is_domain_custom);
    if(configContent) {
        fs.writeFileSync(configFilePath, configContent);
    }
}

async function generateConfigFileContent(domain: string, port: number, is_domain_custom: boolean) {
    if (is_domain_custom) {
        return await generateConfigForCustomDomain(domain, port);
    } else {
        return null;
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
