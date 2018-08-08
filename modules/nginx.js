let config = require('../config.js');
let fs = require('fs');

let subdomain_template = 'server {\r\n\tserver_name EXAMPLE;\r\n\treturn 301 https://EXAMPLE$request_uri;\r\n}\r\n\r\nserver {\r\n\tlisten 443 ssl;\r\n\tserver_name EXAMPLE;\r\n\r\n\tssl_certificate \/etc\/letsencrypt\/live\/engrave.website-0001\/fullchain.pem;\r\n\tssl_certificate_key \/etc\/letsencrypt\/live\/engrave.website-0001\/privkey.pem;\r\n\t\r\nlocation \/ {\r\nd\tproxy_pass http:\/\/localhost:PORT;\r\nd\tproxy_http_version 1.1;\r\nd\tproxy_set_header Upgrade $http_upgrade;\r\nd\tproxy_set_header Connection \'upgrade\';\r\nd\tproxy_set_header Host $host;\r\nd\tproxy_cache_bypass $http_upgrade;\r\n\t}\r\n}';
let domain_template = 'server {\n\tlisten 80;\n\n\tserver_name EXAMPLE www.EXAMPLE;\n\nlocation \/ {\n\tproxy_pass http:\/\/localhost:PORT;\n\tproxy_http_version 1.1;\n\tproxy_set_header Upgrade $http_upgrade;\n\tproxy_set_header Connection \'upgrade\';\n\tproxy_set_header Host $host;\n\tproxy_cache_bypass $http_upgrade;\n   }\n}\n\n';

module.exports.generateSubdomainConfig = (subdomain, port, cb) => {
    let tmp1 = subdomain_template.replace(/EXAMPLE/g, subdomain);
    let tmp2 = tmp1.replace(/PORT/g, port);

    fs.writeFile("/etc/nginx/conf.d/" + port + '_' + subdomain + ".conf", tmp2, (err) => {
        if (!err) {
            console.log(' * Subdomain config for NGINX has been saved successfully');
        }

        if (cb) {
            cb(err);
        }
    });
};

module.exports.generateCustomDomainConfig = (domain, port, cb) => {
    let tmp1 = domain_template.replace(/EXAMPLE/g, domain);
    let tmp2 = tmp1.replace(/PORT/g, port);

    fs.writeFile("/etc/nginx/conf.d/" + port + '_' + domain + ".conf", tmp2, (err) => {
        if (!err){
            console.log(' * Domain config for NGINX has been saved successfully');
        }
        
        if (cb) {
            cb(err);
        }
    });

};