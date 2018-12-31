import * as fs from 'fs';
import * as path from 'path';

const sslCertificatesDirectory = '/etc/letsencrypt/live';

export default function validateDomainCertificates(domain: string) {
    
    const certificatesPath = path.join(sslCertificatesDirectory, domain);
    const fullchainPath = path.join(certificatesPath, 'fullchain.pem');
    const privkeyPath = path.join(certificatesPath, 'privkey.pem');

    if (fs.existsSync(fullchainPath) && fs.existsSync(privkeyPath)) return true;
    else return false;
    
}