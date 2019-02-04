import engine from '../store/engine';
import { Coin } from '../../../helpers/Coin';

async function setCoinHistory(coin: Coin, price: number, date: Date) {

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const timestamp = date.getTime();
    
    const key = `coins:${coin}:${year}:${month}:${day}`;

    console.log(key, timestamp, price);
    
    await engine.rpush(key, price);
    await engine.expire(key, (14 * 24 * 60 * 60)); // 14 days
    
}

export default setCoinHistory;