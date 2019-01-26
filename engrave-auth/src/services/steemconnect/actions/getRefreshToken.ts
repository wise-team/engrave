const secrets = require('@cloudreach/docker-secrets');
import axios from 'axios';

export default async (code: any, scope: any) => {
    
    const client_secret = secrets.SC2_APP_SECRET;

    const options = {
        method: 'POST',
        json: true,
        data: {
            response_type: "refresh",
            code: code,
            client_id: process.env.STEEMCONNECT_ID,
            client_secret: client_secret,
            scope: scope
        },
        url: "https://steemconnect.com/api/oauth2/token"
    };

    return await axios(options);
}