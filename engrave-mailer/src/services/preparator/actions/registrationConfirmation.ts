import * as fs from 'fs';

export default (username: string, domain: string) => {
    const template = fs.readFileSync('/app/src/templates/registration/confirmation.html', 'utf-8');
    const mail = template
        .replace(new RegExp('{USERNAME}', 'g'), `@${username}`)
        .replace(new RegExp('{DOMAIN}', 'g'), domain);

    return mail;
}