import { Request, Response } from 'express';
import { handleResponseError } from '../../../submodules/engrave-shared';
import { Coin } from '../../../helpers/Coin';
import getCoinHistory from '../../../services/cache/actions/getCoinHistory';

const middleware: any[] =  [
];

async function handler(req: Request, res: Response) {
    return handleResponseError(async () => {

        const history = await getCoinHistory(Coin.SBD);
            
        return res.json({
            coin: Coin.SBD,
            history: history
        });
        
    }, req, res);
}

export default {
    middleware,
    handler
}