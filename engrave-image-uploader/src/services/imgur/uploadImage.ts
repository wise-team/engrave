import axios from 'axios';
import * as fs from 'fs';
const qs = require('qs');
const secrets = require('@cloudreach/docker-secrets');

const imgurApiUrl = "https://imgur-apiv3.p.rapidapi.com/3/image";

async function uploadImageFromUrl(url: string) {
    const options = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Client-ID ${secrets.IMGUR_CLIENT_ID}`,
            'X-RapidAPI-Key': secrets.IMGUR_KEY,

        },
        data: qs.stringify({
            image: url
        }),
        url: imgurApiUrl
    };

    const response = await axios(options);

    return response.data.data.link;
}

async function uploadImageFromFile(buffer: any) {

    const options = {
        method: 'POST',
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Client-ID ${secrets.IMGUR_CLIENT_ID}`,
            'X-RapidAPI-Key': secrets.IMGUR_KEY,
        },
        data: buffer, 
        url: imgurApiUrl
    };

    const response = await axios(options);

    return response.data.data.link;
}

export {
    uploadImageFromUrl,
    uploadImageFromFile
}