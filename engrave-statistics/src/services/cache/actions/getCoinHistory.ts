import engine from '../store/engine';
import { Coin } from '../../../helpers/Coin';

async function getCoinHistory(coin: Coin) {

    let history:any = [];

    const now = new Date().getTime();

    for (let d = now; d >= now - (7*24*60*60*1000); d = d - (1*24*60*60*1000)) {
        
        const date = new Date(d);

        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const key = `coins:${coin}:${year}:${month}:${day}`;
        
        const result = await engine.lrange(key, 0, -1);

        if(result) {
            history.push(...result);
        }

    }

    return history;

}

export default getCoinHistory;