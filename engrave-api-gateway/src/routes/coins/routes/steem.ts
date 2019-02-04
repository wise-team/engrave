import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import axios from 'axios';

const middleware: any[] =  [
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const options = {
            method: 'GET',
            url: "http://statistics:3000/coins/steem"
        };
    
        const {data} = await axios(options);
    
        return res.json(data);
        
    }, req, res);
}

export default {
    middleware,
    handler
}