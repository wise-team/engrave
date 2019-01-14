import { IProcessedBlock, processTransaction, IUpdate } from "../blockchain";
import { pushUpdatesToQueue } from "../../redis/redis";
import isUpdateInArray from '../helpers/isUpdateInArray';

const steem = require('steem');

export default async (blockNumber: number): Promise<IProcessedBlock> => {
    try {
        const {transactions, timestamp} = await steem.api.getBlockAsync(blockNumber);

        if(transactions) {
            console.log("Transactions:", transactions.length, "block:", blockNumber);

            let updates: IUpdate[] = [];

            for(const tx of transactions) {
                const update = await processTransaction(tx);
                if(update && !isUpdateInArray(update, updates) ) {
                    console.log('Found Engrave article:', update.author, update.permlink);
                    updates.push(update);
                }
            }

            pushUpdatesToQueue(updates);

            return {
                number: blockNumber,
                timestamp: new Date(timestamp + "Z").getTime()
            };
        }
        
    } catch (error) {
        return null;
    }
}