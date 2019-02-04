import getPrice from '../../services/coins/getPrice';
import setCoinHistory from '../../services/cache/actions/setCoinHistory';
import { Coin } from '../../helpers/Coin';

async function storeCoinsPrice () {
    console.log("Store coins price entered at: " + Date());
    
    try {

        const date = new Date();

        const steem = await getPrice('steem');
        const sbd = await getPrice('steem-dollars');
        const btc = await getPrice('bitcoin');

        await setCoinHistory(Coin.STEEM, steem.price_usd, date);
        await setCoinHistory(Coin.SBD, sbd.price_usd, date);
        await setCoinHistory(Coin.BTC, btc.price_usd, date);

    } catch(err) {
        console.log("Store coins price error: ", err);
    }
    
}

export default storeCoinsPrice;