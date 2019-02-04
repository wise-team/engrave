import axios from 'axios';

async function getPrice(coin: string) {

    try {
        const { data } = await axios.get(`https://api.coinmarketcap.com/v1/ticker/${coin}/`);
        const { price_usd, percent_change_24h } = data[0]

        return {
            price_usd,
            percent_change_24h
        }

    } catch (error) {
        return null;
    }
    
}

export default getPrice;